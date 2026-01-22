import Question from "../Models/questionModel.js";

// ================= CREATE QUESTION =================
export const createQuestion = async (req, res) => {
  try {
    const { quiz, questionText, options, explanation, points } = req.body;

    if (!quiz || !questionText || !options) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const correctOptions = options.filter(o => o.isCorrect === true);
    if (correctOptions.length !== 1) {
      return res
        .status(400)
        .json({ message: "Exactly one correct answer is required" });
    }

    const question = await Question.create({
      quiz,
      questionText,
      options,
      explanation,
      points,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET QUESTIONS BY QUIZ =================
export const getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const questions = await Question.find({ quiz: quizId });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET SINGLE QUESTION =================
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE QUESTION =================
export const updateQuestion = async (req, res) => {
  try {
    const { questionText, options, explanation, points } = req.body;

    if (options) {
      const correctOptions = options.filter(o => o.isCorrect === true);
      if (correctOptions.length !== 1) {
        return res
          .status(400)
          .json({ message: "Exactly one correct answer is required" });
      }
    }

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      {
        questionText,
        options,
        explanation,
        points,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE QUESTION =================
export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
