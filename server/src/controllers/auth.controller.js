import { User } from "../models/User.js";
import { createToken } from "../utils/createToken.js";
import { httpError } from "../utils/httpError.js";

function sendAuthResponse(res, user, statusCode = 200) {
  res.status(statusCode).json({
    token: createToken(user._id.toString()),
    user: user.toSafeObject()
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw httpError(400, "Name, email, and password are required");
    }

    if (password.length < 6) {
      throw httpError(400, "Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw httpError(409, "An account with this email already exists");
    }

    const user = await User.create({ name, email, password });

    sendAuthResponse(res, user, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw httpError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw httpError(401, "Invalid email or password");
    }

    sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
}

export function logout(_req, res) {
  res.json({
    message: "Logged out successfully"
  });
}

export function getMe(req, res) {
  res.json({
    user: req.user.toSafeObject()
  });
}
