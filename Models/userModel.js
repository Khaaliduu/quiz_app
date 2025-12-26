// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // si uu u ogolaado null
    },

    image: {
      type: String,
      default: "https://i.pravatar.cc/150?img=12",
    },

    // AUTH
    password: {
        type: String,
        required: true,
    },


    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // USER STATUS
isBlocked: {
  type: Boolean,
  default: false,
},

isOnline: {
  type: Boolean,
  default: false,
},

lastLogin: {
  type: Date,
},

lastSeen: {
  type: Date,
},

lastActive: {
  type: Date,
},


    // QUIZ DATA
    level: {
      type: Number,
      default: 1,
    },

    points: {
      type: Number,
      default: 0,
    },

    coins: {
      type: Number,
      default: 0,
    },

    completedQuizzes: {
      type: Number,
      default: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
    },

    // PASSWORD RESET
    // resetPasswordToken: String,
    // resetPasswordExpire: Date,
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);


const User = mongoose.model('User', userSchema);
export default User;