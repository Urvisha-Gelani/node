import User from "../models/user.model.js";
import Counter from "../models/counter.model.js";
import logger from "../utils/logger.js";

const getNextSequenceValue = async () => {
  const result = await Counter.findOneAndUpdate(
    { id: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new Error("Failed to generate user ID");
  }
  logger.info(`Next sequence value: ${result}`);
  return result.seq;
};

const userCreated = async (userData) => {
  logger.info(`userData: ${userData}`);
  const nextUserId = await getNextSequenceValue();
  const user = new User({
    id: nextUserId,
    ...userData,
  });
  logger.info(`userCreated: ${user}`);
  await user.save();
  return user;
};

export default userCreated;
