import express from "express";
import protect from "../middleware/protect.js";
import { getLeaderboard, updateLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

// GET Leaderboard
router.get("/", protect, getLeaderboard);

// POST: Update leaderboard after user finishes quiz
router.post("/update", protect, async (req, res) => {
  try {
    const { score, quizId } = req.body;
    if (!score) return res.status(400).json({ message: "Score is required" });

    const leaderboardEntry = await updateLeaderboard({
      userId: req.user._id,
      quizId,
      score,
    });

    res.status(200).json({ message: "Leaderboard updated", leaderboardEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
