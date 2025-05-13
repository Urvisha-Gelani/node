import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import userCreated from "../services/userServices.js";


export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find()
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
    console.error("Failed to get users:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, age } = req.body;

    const existingUser = await User.findOne({ email });
    console.log(existingUser, "******existingUser*****");
    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    const newUser = await userCreated({ name, email, age });
    console.log(newUser, "newUser");

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  console.log(errors, "errors");
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params; 
    const { email } = req.body;

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const existingUser = await User.findOne({
      email,
      id: { $ne: numericId }, 
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }


    const updatedUser = await User.findOneAndUpdate(
      { id: numericId },
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
    console.error("Update failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    console.log(numericId, "numericId");
    const deletedUser = await User.findOneAndUpdate(
      { id: numericId },
      { $set: { isDeleted: true } },
      { new: true }
    );
    console.log(deletedUser, "deletedUser");
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkEmailExists = async (email, excludeId = null) => {
  const query = { email };
  console.log(excludeId, "excludeId");
  if (excludeId) {
    query.id = { $ne: Number(excludeId) }; 
  }

  const user = await User.findOne(query);
  return !!user;
};
