// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectToDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import onlineTracker from "./middleware/onlineTracker.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import quizRoutes from "./Routes/quizRoutes.js";
import questionRoutes from "./Routes/questionRoutes.js";
import leaderboardRoutes from "./Routes/leaderboardRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// 🔥 Create HTTP server (Socket.io wuxuu rabaa tan)
const server = http.createServer(app);

// 🔥 Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectToDB();

// =====================
// SOCKET CONNECTION
// =====================
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// =====================
// MIDDLEWARES
// =====================

// JSON body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Online Tracker Middleware
app.use(onlineTracker); // ✅ muhiim

// =====================
// ROUTES
// =====================

// Test route
app.get("/", (req, res) => {
  res.send("Quiz API is running...");
});

// USERS
app.use("/api/users", userRoutes);

// LEADERBOARD
app.use("/api/leaderboard", leaderboardRoutes);

// CATEGORIES
app.use("/api/categories", categoryRoutes);

// QUIZZES
app.use("/api/quizzes", quizRoutes);

// QUESTIONS
app.use("/api/questions", questionRoutes);

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.io running on port ${PORT}`);
});

// npm run dev
