import express from "express";

const logInRouter = express.Router();
import { register, login, logout } from "../controllers/auth.controller.js";

logInRouter.post("/register", register);
logInRouter.post("/login", login);
logInRouter.post("/logout", logout);

export default logInRouter;
