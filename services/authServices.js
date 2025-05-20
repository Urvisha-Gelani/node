import LogIn from "../models/logIn.model.js";
import jwt from "jsonwebtoken";
import { sendUserRegisterEmail } from "./email.services.js";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { generateUniqueId } from "../helpers/index.js";
dotenv.config();

const userRegister = async (userData) => {
  const nextUserId = await generateUniqueId("logInId");

  const token = jwt.sign({ id: nextUserId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  logger.info(`Generated token: ${token}`);
  logger.info(`User data: ${userData}`);
  const tempUser = new LogIn({
    id: nextUserId,
    ...userData,
    token,
  });
  const { email } = userData;
  await tempUser.save();
  await sendUserRegisterEmail(email, token);
  return tempUser;
};

export default userRegister;
