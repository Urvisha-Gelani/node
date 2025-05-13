export function setUpdatedAt(schema) {
  const updateHook = function (next) {
    this.set({ updatedAt: new Date() });
    next();
  };

  schema.pre("findOneAndUpdate", updateHook);
  schema.pre("updateOne", updateHook);
  schema.pre("updateMany", updateHook);
}
