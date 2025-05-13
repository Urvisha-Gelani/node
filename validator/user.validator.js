import { body } from "express-validator";
import { checkEmailExists } from "../controllers/users.controller.js";

export const createUserValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom(async (value) => {
      const exists = await checkEmailExists(value);
      if (exists) {
        throw new Error("Email already exists");
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
    .custom(async (value, { req }) => {
      const exists = await checkEmailExists(value, req.params.id); // Exclude self
      if (exists) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("age").isInt({ min: 18 }).withMessage("Age must be at least 18"),
];
