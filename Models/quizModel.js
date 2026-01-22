import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    timeLimit: {
      type: Number, // minutes
      default: 10,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
