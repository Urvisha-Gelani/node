import { body } from "express-validator";
import { checkEmailExists } from "../controllers/users.controller.js";
import logger from "../utils/logger.js";

export const createUserValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom(async (value, { req, res }) => {
      logger.info(
        `${value},
        value,
        ${req.params},
        ***************************************************`
      );
      const loginUserId = req.user.id;
      const exists = await checkEmailExists(value, loginUserId);
      if (exists) {
        res.status(422).json({ message: "Email already exists" });
        // throw new Error("Email already exists");
      }
      return true;
    }),
  body("age").isInt({ min: 18 }).withMessage("Age must be at least 18"),
];

export const updateUserValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom(async (value, { req, res }) => {
      const loginUserId = req.user.id;
      const userId = req.params.id;

      const exists = await checkEmailExists(value, loginUserId, userId);
      logger.info(`exists:  ${exists}`);
      if (exists) {
        res.status(422).json({ message: "Email already exists" });
        // throw new Error("Email already exists");
      }
      return true;
    }),
  body("age").isInt({ min: 18 }).withMessage("Age must be at least 18"),
];
