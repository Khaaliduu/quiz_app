import User from "../Models/userModel.js";

/**
 * Middleware-kan:
 * 1. Update gareynayaa lastActive request kasta
 * 2. Haddii user-ku muddo dheer falgal la’aan yahay → offline
 */

const ONLINE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

const onlineTracker = async (req, res, next) => {
  try {
    // Haddii uusan jirin user (login/register), iska dhaaf
    if (!req.user || !req.user.id) {
      return next();
    }

    const user = await User.findById(req.user.id);
    if (!user) return next();

    const now = new Date();

    // Update lastActive
    user.lastActive = now;

    // Haddii hore online u ahaa, hubi timeout
    if (user.isOnline && user.lastActive) {
      const diff = now - new Date(user.lastActive);

      if (diff > ONLINE_TIMEOUT) {
        user.isOnline = false;
        user.lastSeen = now;
      }
    }

    await user.save();
    next();
  } catch (error) {
    console.error("OnlineTracker Error:", error.message);
    next();
  }
};

export default onlineTracker;
