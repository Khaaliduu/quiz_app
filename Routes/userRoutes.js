// routes/UserRoutes.js
import express from "express";
import protect from '../middleware/protect.js';
const router = express.Router();

// Controllers
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  toggleBlockUser,
  setUserOnline,
  changePassword,
  toggleAdmin,
  logoutUser,
  deleteUser,
  getMe
} from "../controllers/userController.js";

// Middleware placeholders (mustaqbalka waxaad ka dhigi kartaa functional)
// // import { protect, admin } from "../middleware/authMiddleware.js";
// const protect = (req, res, next) => { next(); }; // placeholder
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
// Logout user

router.post("/logout", protect, logoutUser);
// Set user online
router.post("/online", protect, setUserOnline);


// Logout user (requires authentication)
// router.post("/logout", protect, logoutUser);

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// Get all users (ADMIN only)
router.get("/", protect, admin, getAllUsers);

// SAX AH ✅
router.get("/me", protect, getMe);

// Get single user by ID
router.get("/:id", protect, getUserById);

// Get 

// ✅ Change password (KA HOR)
router.put("/change-password/:id", changePassword);

// ✅ Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", protect, deleteUser);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Block / Unblock user
router.put("/block/:id", protect, admin, toggleBlockUser);

// PUT /api/users/make-admin/:id
router.put("/make-admin/:id", toggleAdmin);


// Export router
export default router;
