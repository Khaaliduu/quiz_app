
// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";

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

// User routes
app.use("/api/users/", userRoutes);

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