import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import userCreated from "../services/userServices.js";
import logger from "../utils/logger.js";
import { Logger } from "winston";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const loginUserId = req.user.id;
    logger.info(`loginUserId: ${loginUserId}`);
    const users = await User.find({
      loginUserId,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    res.set({
      "Total-Users": totalUsers,
      "Total-Pages": totalPages,
      "Current-Page": page,
      "Per-Page": limit,
    });

    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};
export const createUser = async (req, res) => {
  // const errors = validationResult(req);
  // logger.error(`errors: ${errors}`);
  // if (!errors.isEmpty())
  //   return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, age } = req.body;

    const loginUserId = req.user.id;
    const existingUser = await User.findOne({
      email,
      loginUserId,
    });
    logger.info(`existingUser: ${existingUser}`);
    if (existingUser) {
      logger.error(`createUser: Email already exists`);
      return res.status(422).json({ message: "Email already exists" });
    }
    logger.info(`loginUserId: ${loginUserId}`);
    logger.info(`req.user: ${req.user}`);
    const newUser = await userCreated({
      name,
      email,
      age,
      loginUserId,
    });
    logger.info(`newUser: ${newUser}`);

    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Failed to create user: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  // const errors = validationResult(req);
  // logger.error(`errors: ${errors}`);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  try {
    const { id } = req.params;
    const { email } = req.body;
    const loginUserId = req.user.id;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const existingUser = await User.findOne({
      email,
      loginUserId,
      id: { $ne: numericId },
    });

    if (existingUser) {
      logger.error(`updateUser: Email already exists`);
      return res.status(422).json({ message: "Email already exists" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { id: numericId, loginUserId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const loginUserId = req.user.id;
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    logger.info(`numericId: ${numericId}`);
    const deletedUser = await User.findOneAndDelete({
      id: id,
      loginUserId,
    });
    Logger.info(`deletedUser: ${deletedUser}`);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkEmailExists = async (
  email,
  loginUserId,
  excludeId = null
) => {
  const query = { email, loginUserId };
  logger.info(`query: ${query}`);
  logger.info(`excludeId: ${excludeId}`);
  if (excludeId) {
    query.id = { $ne: Number(excludeId) };
  }

  const user = await User.findOne(query);
  return !!user;
};
