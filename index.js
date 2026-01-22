
// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import onlineTracker from "./middleware/onlineTracker.js";
import categoryRoutes  from './Routes/categoryRoutes.js';
import quizRoutes from "./Routes/quizRoutes.js";
import questionRoutes from "./Routes/questionRoutes.js";
import leaderboardRoutes from "./Routes/leaderboardRoutes.js";


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectToDB();

// =====================
// MIDDLEWARES
// =====================

// JSON body parser
app.use(express.json());

// Enable CORS for all origins (Flutter & frontend access)
app.use(cors());

// =====================
// ROUTES
// =====================

// Test route
app.get("/", (req, res) => {
  res.send("Quiz API is running...");
});
// Online Tracker Middleware
app.use(onlineTracker); // ✅ muhiim

// =====================
//  USERS ROUTE
// =====================
app.use("/api/users/", userRoutes);




// =====================
//  LEADERBOARD ROUTE
// =====================
app.use("/api/leaderboard", leaderboardRoutes);


// =====================
// CATEGORY ROUTES
// =====================
app.use("/api/categories", categoryRoutes);


// =====================
//  quiz ROUTES
// =====================
app.use("/api/quizzes", quizRoutes);

// =====================
//  question ROUTES
// =====================
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
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


// npm run dev