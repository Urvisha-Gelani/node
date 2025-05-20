import { generateUniqueId } from "../helpers/index.js";
import Payment from "../models/payment.model.js";
import logger from "../utils/logger.js";

const paymentCreated = async (paymentData) => {
  logger.info(`paymentData: ${paymentData}`);
  const nextUserId = await generateUniqueId("paymentId");
  console.log("nextUserId", nextUserId);
  const payment = new Payment({
    id: nextUserId,
    ...paymentData,
  });
  logger.info(`paymentCreated: ${payment}`);
  await payment.save();
  return payment;
};

export default paymentCreated;
