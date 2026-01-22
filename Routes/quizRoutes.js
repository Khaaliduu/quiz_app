import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizzesByCategory,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/category/:categoryId", getQuizzesByCategory);
router.get("/:id", getQuizById);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;
