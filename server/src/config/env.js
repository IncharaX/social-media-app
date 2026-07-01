import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/unlox_social",
  jwtSecret: process.env.JWT_SECRET || "development_secret_change_me",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};
