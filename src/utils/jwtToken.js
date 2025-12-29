import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const jwtToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: "5d" }
  );
};

export default jwtToken;
