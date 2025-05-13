import User from "../models/user.model.js";
import Counter from "../models/counter.model.js";

const getNextSequenceValue = async () => {
  const result = await Counter.findOneAndUpdate(
    { id: "userId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new Error("Failed to generate user ID");
  }
  console.log(result, "result");
  return result.seq;
};

const userCreated = async (userData) => {
  console.log(userData, "userData");
  const nextUserId = await getNextSequenceValue();
  const user = new User({
    id: nextUserId,
    ...userData,
  });
  await user.save();
  return user;
};

export default userCreated;
