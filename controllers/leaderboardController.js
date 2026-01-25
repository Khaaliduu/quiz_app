import Leaderboard from "../Models/leaderboardModel.js";
import User from "../Models/userModel.js";
import mongoose from "mongoose";
import { io } from "../index.js";

/* ===============================
   HELPER: TIME RANGE
================================ */
const getTimeRange = (type = "weekly") => {
  const now = new Date();

  if (type === "weekly") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  if (type === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }
};

/* ===============================
   GET LEADERBOARD
   GET /api/leaderboard?type=weekly|monthly
================================ */
export const getLeaderboard = async (req, res) => {
  try {
      const { type = "weekly", quizId } = req.query;
      const range = getTimeRange(type);

      // Build match condition. For 'all' (no time range) we don't filter by createdAt.
      const match = {};
      if (range && range.start && range.end) {
        match.createdAt = { $gte: range.start, $lte: range.end };
      }

    if (quizId) {
      match.quizId = new mongoose.Types.ObjectId(quizId);
    }

    const leaderboard = await Leaderboard.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    const result = leaderboard.map((item, index) => {
      let medal = null;
      if (index === 0) medal = "🥇";
      else if (index === 1) medal = "🥈";
      else if (index === 2) medal = "🥉";

      return {
        rank: index + 1,
        medal,
        totalScore: item.totalScore,
        user: {
          id: item.user._id,
          name: item.user.name,
          image: item.user.image,
        },
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   UPDATE LEADERBOARD (REAL-TIME)
   Called after quiz finished
================================ */
export const updateLeaderboard = async ({ userId, quizId, score }) => {
  try {
    // 1️⃣ Save quiz score
    const entry = await Leaderboard.create({
      userId,
      quizId,
      score,
    });

    // 2️⃣ Update user quiz stats (kuwa jira userModel)
    await User.findByIdAndUpdate(userId, {
      $inc: {
        points: score,
        completedQuizzes: 1,
        correctAnswers: score, // haddii score = correct answers
      },
    });

    // 3️⃣ 🔥 REAL-TIME UPDATE
    io.emit("leaderboardUpdated", {
      type: "weekly",
      quizId,
    });

    return entry;
  } catch (error) {
    console.error("Leaderboard update error:", error.message);
    throw error;
  }
};
