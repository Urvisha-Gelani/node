import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_PORT = process.env.FRONTEND_PORT || 3003;
const FRONTEND_ORIGIN = `http://localhost:${FRONTEND_PORT}`;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl or postman)
    if (!origin) return callback(null, true);

    if (origin === FRONTEND_ORIGIN) {
      return callback(null, true);
    } else {
      const error = new Error("Not allowed by CORS");
      error.status = 500;
      return callback(error);
    }
  },
  credentials: true,
  exposedHeaders: [
    "Total-Users",
    "Total-Pages",
    "Current-Page",
    "Per-Page",
    "Authorization",
  ],
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
