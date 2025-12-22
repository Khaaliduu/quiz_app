// controllers/userController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";


/*
|--------------------------------------------------------------------------
| Helper Function: Generate JWT Token
|--------------------------------------------------------------------------
*/
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/*
|--------------------------------------------------------------------------
| @desc    Register New User
| @route   POST /api/users/register
| @access  Public
|--------------------------------------------------------------------------
*/
// import { generateToken } from "../utils/generateToken.js"; // hubi inaad leedahay util-kan

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, image } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // 2️⃣ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      image: image || "",
    });

    // 5️⃣ Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // debug purposes
    });
  }
};


// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, phone, password, image } = req.body;

//     // Hubi in user horey u diiwaan gashan yahay
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Hash password ka hor save
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Samee user cusub
//     const user = await User.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       image,
//     });

//     if (user) {
//       res.status(201).json({
//         success: true,
//         message: `User registered successfully ${user}`, 
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           points: user.points,
//         },
//         token: generateToken(user._id),
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//     // res.status(500).json({ error: error.message });

//   }
// };

/*
|--------------------------------------------------------------------------
| @desc    Login User
| @route   POST /api/users/login
| @access  Public
|--------------------------------------------------------------------------
*/
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hel user-ka email ahaan
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Hubi in user-ka la block-gareyn
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }

    // Hubi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update online status & last login
    user.isOnline = true;
    user.lastLogin = Date.now();
    await user.save();

    // Return response
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        level: user.level,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| @desc    Get All Users (Admin Only)
| @route   GET /api/users
| @access  Private/Admin
|--------------------------------------------------------------------------
*/
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| @desc    Get User By ID
| @route   GET /api/users/:id
| @access  Private
|--------------------------------------------------------------------------
*/
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| @desc    Update User Profile
| @route   PUT /api/users/:id
| @access  Private
|--------------------------------------------------------------------------
*/
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only fields la soo diray
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.image = req.body.image || user.image;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| @desc    Block / Unblock User (Admin)
| @route   PUT /api/users/block/:id
| @access  Private/Admin
|--------------------------------------------------------------------------
*/
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| @desc    Logout User
| @route   POST /api/users/logout
| @access  Private
|--------------------------------------------------------------------------
*/
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.isOnline = false;
    await user.save();

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  

};
  
/*
|--------------------------------------------------------------------------
| @desc    Delete User
| @route   DELETE /api/users/:id
| @access  Private
|--------------------------------------------------------------------------
*/


// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Hubi in user ID la bixiyay
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 2️⃣ Hel user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Delete user using deleteOne
    await User.deleteOne({ _id: userId });

    // 4️⃣ Response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
