// app.js
import express from "express";
import userRoutes from "./routes/user.routes.js";
import corsMiddleware from "./config/cors.config.js";
import logInRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
app.use(corsMiddleware);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/", logInRouter);

app.use(errorHandler);

export default app;
