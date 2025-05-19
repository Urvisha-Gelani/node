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
import authenticateToken from "../middlewares/auth.middleware.js";
import upload from "../config/multer.config.js";

const userRouter = express.Router();
userRouter.use(authenticateToken);

userRouter.get("/", getUsers);

userRouter.post(
  "/",
  upload.array("avatars"),
  createUserValidator,
  createUser
);

userRouter.patch(
  "/:id",
  upload.array("avatars"),
  updateUserValidator,
  updateUser
);

userRouter.delete("/:id", deleteUser);

export default userRouter;
