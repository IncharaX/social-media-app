import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "7d"
  });
}
