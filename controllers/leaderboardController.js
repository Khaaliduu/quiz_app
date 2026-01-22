import Leaderboard from "../Models/leaderboardModel.js";
import User from "../Models/userModel.js";
import mongoose from "mongoose";

// Helper: get start & end date for week/month
const getTimeRange = (type = "weekly") => {
  const now = new Date();
  if (type === "weekly") {
    const start = new Date(now.setDate(now.getDate() - now.getDay()));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  } else if (type === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
};

// GET Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { type = "weekly", quizId } = req.query;
    const { start, end } = getTimeRange(type);

    const match = { createdAt: { $gte: start, $lte: end } };
    if (quizId) match.quizId = mongoose.Types.ObjectId(quizId);

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
      let medal = "";
      if (index === 0) medal = "1🥇";
      else if (index === 1) medal = "2🥈";
      else if (index === 2) medal = "3🥉";

      return {
        rank: index + 1,
        user: {
          id: item.user._id,
          name: item.user.name,
          image: item.user.image,
        },
        totalScore: item.totalScore,
        medal,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡️ Function to update leaderboard in real-time after a quiz
export const updateLeaderboard = async ({ userId, quizId, score }) => {
  try {
    // 1️⃣ Save score to leaderboard collection
    const leaderboardEntry = new Leaderboard({ userId, quizId, score });
    await leaderboardEntry.save();

    // 2️⃣ Update user's totalScore and quizzesPlayed
    const user = await User.findById(userId);
    user.totalScore += score;
    user.quizzesPlayed += 1;
    await user.save();

    // 3️⃣ Optional: Emit real-time leaderboard update via Socket.IO
    // io.emit("leaderboardUpdated"); 
    // (Client side should listen and refetch leaderboard)

    return leaderboardEntry;
  } catch (error) {
    console.error("Leaderboard update error:", error.message);
    throw error;
  }
};
