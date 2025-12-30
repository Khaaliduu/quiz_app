import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";

// --------------------------
// JWT Helper
// --------------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};



// --------------------------
// GET CURRENT USER (ME)
// --------------------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ❗ Haddii user logout sameeyay
    if (user.logoutAt && user.logoutAt > user.lastLogin) {
      return res.status(401).json({ message: "Session expired" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// --------------------------
// REGISTER USER
// --------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, image, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        // success: false,
        message: "User already exists",
      });
    } else {
      console.log("No existing user found with this email. Proceeding to register.");
    

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone: phone || null,
      password,
      image: image || "https://i.pravatar.cc/150?img=12",
      role: role || "user",
    });

    res.status(201).json({
      // success: true,
      // message: "User registered successfully",
      user,
      token: generateToken(user._id),
    }); }
  } catch (e) {
        res.status(500).json({ error: e.message });

    // console.error("REGISTER ERROR:", error);
    // res.status(500).json({
    //   success: false,
    //   message: "Internal server error",
    //   error: error.message,
    // });
  }
};

// --------------------------
// LOGIN USER
// --------------------------

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Password check
    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }
        // ✅ Update online status
        user.isOnline = true;
        user.lastActive = new Date();
        user.lastLogin = new Date();
        await user.save();



    // Hadda backend-ku wuxuu soo celiyaa user + token
    res.status(200).json({
      user,
      token: generateToken(user._id),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


// --------------------------
// SET USER ONLINE (PING)
// --------------------------
export const setUserOnline = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isOnline = true;
    user.lastLogin = new Date();
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// --------------------------
// GET ALL USERS (ADMIN)
// --------------------------


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --------------------------
// GET USER BY ID
// --------------------------

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --------------------------
// UPDATE USER PROFILE
// --------------------------

// export const updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     user.name = req.body.name || user.name;
//     user.phone = req.body.phone || user.phone;
//     user.image = req.body.image || user.image;
//     user.role = req.body.role || user.role; // Haddii admin update garayo

//     const updatedUser = await user.save();

//     res.json({
//       success: true,
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// Update Userimport mongoose from "mongoose";
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, image } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.image = image ?? user.image;

    await user.save();

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// --------------------------
// BLOCK / UNBLOCK USER
// --------------------------
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --------------------------
// LOGOUT USER
// --------------------------
// controllers/userController.js
export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isOnline = false;
    user.lastSeen = new Date();
    user.logoutAt = new Date(); // ✅ MUHIIM
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// export const logoutUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.isOnline = false;
//     user.lastSeen = new Date();
//     await user.save();

//     res.json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// --------------------------
// DELETE USER
// --------------------------
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await User.deleteOne({ _id: req.params.id });
    res.json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};



// --------------------------
// CHANGE PASSWORD
// --------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check old password (plain text)
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ✅ Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// --------------------------
// TOGGLE ADMIN ROLE
// --------------------------
// Toggle user role admin / user
export const toggleAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle role
    user.role = user.role === "admin" ? "user" : "admin";

    await user.save();

    res.json({
      message: "Role updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
