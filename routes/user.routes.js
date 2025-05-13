import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../validator/user.validator.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.post("/", createUserValidator, createUser);

userRouter.patch("/:id", updateUserValidator, updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
