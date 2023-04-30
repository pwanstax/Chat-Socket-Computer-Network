import express from "express";
import csrf from "csrf";
import usersRouter from "./user.route.js";
import chatRouter from "./chat.route.js";
import {
  checkValidationError,
  errorHandler,
} from "../middlewares/error-handler.middleware.js";

const csrfProtection = new csrf();
const router = express.Router();

router.use(
  "/",
  (req, res, next) => {
    if (req.path.startsWith("/api")) {
      const token = req.cookies["csrf-token"];
      if (!token || !csrfProtection.verify(process.env.JWT_SECRET, token)) {
        res.status(403).json({error: "Invalid CSRF token"});
        return;
      }
    }
    next();
  },
  usersRouter,
  chatRouter
);
router.use(checkValidationError, errorHandler);

export default router;
