// server.js
import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const interfaces = os.networkInterfaces();
let localIP = "localhost";

for (const iface of Object.values(interfaces)) {
  for (const config of iface) {
    if (config.family === "IPv4" && !config.internal) {
      localIP = config.address;
      break;
    }
  }
}

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, localIP, () => {
    console.log(`🚀  Server running at http://${localIP}:${PORT}`);
  });
});
