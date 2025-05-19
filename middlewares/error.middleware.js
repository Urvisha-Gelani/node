import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err);

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: `Duplicate field value: ${JSON.stringify(err.keyValue)}`,
    });
  }
  console.log(err.status , "err.status+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
  const statusCode = err.status || 500;
  logger.warn(`Status Code: ${statusCode}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
