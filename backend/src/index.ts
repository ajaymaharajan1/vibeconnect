import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import apiRoutes from "./routes/api.routes";
import { initSocketHandlers } from "./sockets/chat.socket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"; // Bind to all interfaces for public deployment

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001", "*"];

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// API Endpoints
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "VibeConnect Backend API",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocketHandlers(io);

server.listen(Number(PORT), HOST, () => {
  console.log(`🚀 VibeConnect Production API Server running on http://${HOST}:${PORT}`);
});
