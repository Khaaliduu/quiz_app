import express from "express";
import protect from "../middleware/protect.js";

import {
  createQuestion,
  getQuestionsByQuiz,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};

const router = express.Router();

// ================= ADMIN =================
router.post("/", protect, admin, createQuestion);
router.put("/:id", protect, admin, updateQuestion);
router.delete("/:id", protect, admin, deleteQuestion);

// ================= USER / ADMIN =================
router.get("/quiz/:quizId", protect, getQuestionsByQuiz);
router.get("/:id", protect, getQuestionById);

export default router;
