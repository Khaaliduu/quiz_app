import express from "express";
import protect from "../middleware/protect.js";
import {
  getLeaderboard,
  updateLeaderboard,
} from "../controllers/leaderboardController.js";

const router = express.Router();

/* =====================================
   GET LEADERBOARD
   /api/leaderboard?type=weekly|monthly
===================================== */
router.get("/", protect, getLeaderboard);

/* =====================================
   UPDATE LEADERBOARD
   POST /api/leaderboard/update
   Body: { score, quizId }
===================================== */
router.post("/update", protect, async (req, res) => {
  try {
    const { score, quizId } = req.body;

    if (score === undefined) {
      return res.status(400).json({
        message: "Score is required",
      });
    }

    const entry = await updateLeaderboard({
      userId: req.user._id,
      quizId,
      score,
    });

    res.status(200).json({
      success: true,
      message: "Leaderboard updated successfully",
      entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
