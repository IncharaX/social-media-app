import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { api } from "./api.js";
import { clearStoredToken, getStoredToken, setStoredToken } from "./tokenStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let ignore = false;
    const token = getStoredToken();

    if (!token) {
      setIsBooting(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        if (!ignore) setUser(data.user);
      })
      .catch(() => {
        clearStoredToken();
        if (!ignore) setUser(null);
      })
      .finally(() => {
        if (!ignore) setIsBooting(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    setStoredToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    setStoredToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearStoredToken();
      setUser(null);
    }
  }

  const syncUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBooting,
      register,
      login,
      logout,
      syncUser
    }),
    [user, isBooting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
