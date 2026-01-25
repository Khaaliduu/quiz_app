import express from "express";
import protect from '../middleware/protect.js';

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/categoryController.js";

const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};
const router = express.Router();

// Public: allow users to fetch active categories without admin
router.get("/", getCategories);
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
// Public: fetch category details
router.get("/:id", getCategoryById);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
