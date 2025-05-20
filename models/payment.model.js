// models/Payment.js
import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimestamp.middleware.js";

const paymentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    amount: Number,
    currency: String,
    stripeCustomerId: String,
    stripePaymentIntentId: String,
    status: String,
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    payableUserId: {
      type: Number,
      ref: "User",
      required: true,
    },
    loginUserId: {
      type: Number,
      ref: "LogIn",
      required: true,
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

setUpdatedAt(paymentSchema);
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
