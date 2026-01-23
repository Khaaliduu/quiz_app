import Quiz from "../Models/quizModel.js";

/**
 * @desc   Create new quiz
 * @route  POST /api/quizzes
 */
export const createQuiz = async (req, res) => {
  try {
    const { title, description, categoryId, level, timeLimit } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({
        message: "Title and Category are required",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      categoryId,
      level,
      timeLimit,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get all quizzes
 * @route  GET /api/quizzes
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("categoryId", "image title")
      .sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get quizzes by category
 * @route  GET /api/quizzes/category/:categoryId
 */
export const getQuizzesByCategory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      categoryId: req.params.categoryId,
      isActive: true,
    });

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get single quiz
 * @route  GET /api/quizzes/:id
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "categoryId",
      "name"
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Update quiz
 * @route  PUT /api/quizzes/:id
 */
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.title = req.body.title || quiz.title;
    quiz.description = req.body.description || quiz.description;
    quiz.level = req.body.level || quiz.level;
    quiz.timeLimit = req.body.timeLimit || quiz.timeLimit;
    quiz.isActive =
      req.body.isActive !== undefined ? req.body.isActive : quiz.isActive;

    const updatedQuiz = await quiz.save();

    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Delete quiz
 * @route  DELETE /api/quizzes/:id
 */
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await quiz.deleteOne();

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
