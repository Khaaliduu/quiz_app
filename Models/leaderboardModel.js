import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: false },
  score: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
