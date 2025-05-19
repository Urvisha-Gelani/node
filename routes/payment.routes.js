import express from "express";
import { createPayment } from "../controllers/payment.controller.js";
const paymentRouter = express.Router();
paymentRouter.post("/payments", createPayment);
export default paymentRouter;
