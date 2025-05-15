import LogIn from "../models/logIn.model.js";
import jwt from "jsonwebtoken";
import userRegister from "../services/authServices.js";
import { sendWelcomeEmail } from "../services/email.services.js";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();
logger.info(`JWT_SECRET: ${process.env.JWT_SECRET}`);
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await LogIn.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = await userRegister({ email, password });
    logger.info(`New user registered: ${newUser}`);

    res.status(201).json(newUser);
  } catch (err) {
    logger.error(`Registration error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await LogIn.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let token = user.token;
    let isTokenExpired = false;

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        logger.info("Token is valid");
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          isTokenExpired = true;
        } else {
          return res.status(401).json({ message: "Invalid token" });
        }
      }
    } else {
      isTokenExpired = true;
    }

    if (isTokenExpired) {
      token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      user.token = token;
      await user.save();
    }
    res.set("Authorization", `Bearer ${token}`);
    await sendWelcomeEmail(email, token);
    logger.info(`Welcome email sent to: ${email}`);
    res.status(200).json({
      message: "Login successful",
      email: user.email,
    });
  } catch (err) {
    logger.error(`Login error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  const { email } = req.body;
  logger.info(`Logout request for email: ${email}`);

  try {
    const user = await LogIn.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await LogIn.updateOne({ email }, { $unset: { token: "" } });
    await user.save();
    res.status(200).json({ message: "User signed out successfully" });
  } catch (err) {
    logger.error(`Logout error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};
