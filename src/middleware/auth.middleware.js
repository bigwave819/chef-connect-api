import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const ProtectedRoute = async (req, res, next) => {
  try {
    // Look for token in cookies OR authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

export default ProtectedRoute;