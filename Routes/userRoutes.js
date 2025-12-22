// routes/UserRoutes.js
import express from "express";
const router = express.Router();

// Controllers
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleBlockUser,
  // logoutUser,
  deleteUser,
} from "../Controllers/userController.js"; 

// Middleware placeholders (mustaqbalka waxaad ka dhigi kartaa functional)
// // import { protect, admin } from "../middleware/authMiddleware.js";
const protect = (req, res, next) => { next(); }; // placeholder
const admin = (req, res, next) => { next(); };   // placeholder

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/



// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Logout user (requires authentication)
// router.post("/logout", protect, logoutUser);

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// Get all users (ADMIN only)
router.get("/", protect, admin, getAllUsers);

// Get single user by ID
router.get("/:id", protect, getUserById);

// Update user profile
router.put("/:id", protect, updateUser);

// Delete user profile
router.delete("/:id", protect, deleteUser);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Block / Unblock user
router.put("/block/:id", protect, admin, toggleBlockUser);

// Export router
export default router;
