import winston from "winston";
import moment from "moment-timezone";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () =>
        moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
