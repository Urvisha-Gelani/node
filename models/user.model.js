import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimestamp.middleware.js";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    loginUserId: {
      type: Number,
      ref: "LogIn",
      required: true,
    },
    avatars: [{ type: String, required: false, unique: true }], // Store image file paths
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
setUpdatedAt(userSchema);
const User = mongoose.model("User", userSchema);
export default User;
