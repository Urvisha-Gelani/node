import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  logger.info(`Authorization header: ${authHeader}`);
  logger.info(`Token extracted: ${token}`);
  if (!token) {
    logger.error("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Decoded token: ${decoded.id}`);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    logger.error(`Token verification error: ${err}`);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default authenticateToken;
