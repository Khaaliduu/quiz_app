import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  // ✅ 1. Hel token (Bearer ama x-auth-token)
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  // ❌ Haddii token maqan yahay
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token missing",
    });
  }

  try {
    // ✅ 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 3. Hel user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    // ✅ 4. Ku xir user request-ka
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({
      message: "Not authorized, token invalid or expired",
    });
  }
};

export default protect;
