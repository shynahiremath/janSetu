import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { attachSocket } from "./sockets/index.js";

import authRoutes from "./routes/auth.routes.js";
import agricultureRoutes from "./routes/agriculture.routes.js";
import healthRoutes from "./routes/health.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import irrigationRoutes from "./routes/irrigation.routes.js";
import yieldRoutes from "./routes/yield.routes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
});
app.set("io", io);
attachSocket(io);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));

app.get("/api/health-check", (req, res) => res.json({ ok: true, service: "jan-setu-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/agriculture", agricultureRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/irrigation", irrigationRoutes);
app.use("/api/yield", yieldRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Jan Setu API running on port ${PORT}`));
});