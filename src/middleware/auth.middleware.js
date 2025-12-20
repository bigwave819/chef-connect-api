import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from '../config/env.js'

const ProtectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided, authorization denied"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("profile");

    if (!user) {
      return res.status(401).json({
        message: "User not found, authorization denied"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default ProtectedRoute;


export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - user not found' })
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden - admin access only" })
  }

  next()
}