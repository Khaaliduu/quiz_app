import Category from "../Models/category.js";

// ================= CREATE CATEGORY (ADMIN).
export const createCategory = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const category = await Category.create({
      title,
      description,
      image,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL CATEGORIES (USER)
export const getCategories = async (req, res) => {
  try {
    const category = await Category.create({
  title,
  description,
  image,
  isActive: true,
});


    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET CATEGORIES PAY ID (USER)
export const getCategoryById  = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Category", error: error.message });
  }
};

// ================= UPDATE CATEGORY (ADMIN)
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE CATEGORY (ADMIN)
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
