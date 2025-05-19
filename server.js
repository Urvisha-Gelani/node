import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const interfaces = os.networkInterfaces();
logger.info(`interfaces: ${interfaces}`);
export const getLocalIP = () => {
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
};

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err}`);
  process.exit(1); // Optional: crash app
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

const localIP = getLocalIP() || "localhost";
logger.info(`Local IP:", ${localIP}`);
export const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, localIP, () => {
    logger.info(`🚀  Server running at http://${localIP}:${PORT}`);
  });
});
