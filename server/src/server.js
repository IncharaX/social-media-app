import http from "http";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { attachChatServer } from "./realtime/chat.js";

await connectDatabase();

const server = http.createServer(app);

attachChatServer(server);

server.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
