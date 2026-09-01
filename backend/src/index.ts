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
const HOST = process.env.HOST || "0.0.0.0";

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

// Root landing route for health & deployment verification
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VibeConnect API Server</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #090d16; color: #f8fafc; text-align: center; padding: 60px 20px; margin: 0; }
          .card { background: #0f172a; border: 1px solid #1e293b; max-width: 520px; margin: 0 auto; padding: 36px; border-radius: 24px; shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          h1 { font-size: 24px; font-weight: 800; margin-top: 20px; margin-bottom: 8px; background: linear-gradient(to right, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
          .info { background: #1e293b; padding: 14px; border-radius: 12px; font-size: 13px; color: #cbd5e1; word-break: break-all; }
          code { font-family: monospace; color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">🟢 API Server Live & Healthy</span>
          <h1>🚀 VibeConnect Backend API</h1>
          <p>Multi-City Social Discovery Platform with Real-Time PostgreSQL Database & Socket.IO WebSockets.</p>
          <div class="info">
            API Endpoints: <code>/api</code> | Health Check: <code>/health</code>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "VibeConnect Backend API",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Endpoints
app.use("/api", apiRoutes);

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
