import Counter from "../models/counter.model.js";
import logger from "../utils/logger.js";
export const generateUniqueId = async (name) => {
  const result = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new Error("Failed to generate user ID");
  }
  logger.info(`Next sequence value: ${result}`);
  return result.seq;
};
