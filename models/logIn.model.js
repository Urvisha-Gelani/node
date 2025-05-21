import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { setUpdatedAt } from "../middlewares/updateTimestamp.middleware.js";
import { hashPasswordMiddleware } from "../middlewares/password.middleware.js";

const logInSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    token: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);

logInSchema.pre("save", hashPasswordMiddleware);

logInSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
setUpdatedAt(logInSchema);
const LogIn = mongoose.model("LogIn", logInSchema);
export default LogIn;
