import { api } from "./api.js";

export async function getProfile() {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch("/users/me", payload);
  return data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data.user;
}

export async function followUser(userId) {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
}

export async function unfollowUser(userId) {
  const { data } = await api.delete(`/users/${userId}/follow`);
  return data;
}
