import winston from "winston";
import moment from "moment-timezone";
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
    }),
    // display time according to UTC time zone
    // winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error", // only error
    }),
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info", // info and above, but exclude errors via filter
      format: winston.format.combine(
        winston.format((info) => (info.level === "info" ? info : false))()
      ),
    }),
  ],
});

export default logger;