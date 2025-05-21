import express from "express";
import {
  createPayment,
  getPayment,
} from "../controllers/payment.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
const paymentRouter = express.Router();
paymentRouter.use(authenticateToken);

paymentRouter.post("/payments", createPayment);
paymentRouter.get("/payments", getPayment);

export default paymentRouter;
