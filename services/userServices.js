import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import { generateUniqueId } from "../helpers/index.js";

const userCreated = async (userData) => {
  logger.info(`userData: ${userData}`);
  const nextUserId = await generateUniqueId("userId");
  const user = new User({
    id: nextUserId,
    ...userData,
  });
  logger.info(`userCreated: ${user}`);
  await user.save();
  return user;
};

export default userCreated;
