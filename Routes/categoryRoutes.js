import express from "express";
import protect from '../middleware/protect.js';

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/categoryController.js";

const admin = (req, res, next) => { next(); };   // placeholder
const router = express.Router();

router.get("/",getCategories);
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.get("/:id", protect, admin, getCategoryById);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
