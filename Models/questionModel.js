import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [optionSchema],
      validate: [v => v.length >= 2, "At least 2 options required"],
    },

    explanation: {
      type: String,
      default: "",
    },

    points: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
/* Waa Question Model kaa oo ka koobaan
   quiz (oo ah foreign key u ah Quiz model),
   questionText,                
        options (array ka kooban optionSchema),*/