// models/Payment.js
import mongoose from "mongoose";
import { setUpdatedAt } from "../middlewares/updateTimestamp.middleware.js";

const paymentSchema = new mongoose.Schema(
  {
    amount: Number,
    currency: String,
    stripeCustomerId: String,
    stripePaymentIntentId: String,
    status: String,
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
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
export default mongoose.model("Payment", paymentSchema);
