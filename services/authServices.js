import LogIn from "../models/logIn.model.js";
import Counter from "../models/counter.model.js";
import jwt from "jsonwebtoken";
import { sendUserRegisterEmail } from "./email.services.js";

const getNextSequenceValue = async () => {
  const result = await Counter.findOneAndUpdate(
    { id: "logInId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new Error("Failed to generate user ID");
  }
  console.log(result, "result");
  return result.seq;
};

const userRegister = async (userData) => {
  const nextUserId = await getNextSequenceValue();

  const token = jwt.sign({ id: nextUserId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log(userData, "userData**********");
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
