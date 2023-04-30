import express from "express";
import {
  createUser,
  localLogin,
  logout,
  forgotPassword,
  resetPassword,
  checkLogin,
  addUserInfo,
  getUserInfo,
  getUserRole,
  googleAuth,
  googleCallback,
  getNavbarInfo,
  getAllChat,
  getAllUsers,
  getCSRF,
} from "../controllers/user.controller.js";
import {errorHandler} from "../middlewares/error-handler.middleware.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/image.middleware.js";

const router = express.Router();

router.route("/user").post(createUser);

router.route("/user/login").post(localLogin); // login
router.route("/auth/google").get(googleAuth);
router.route("/auth/google/callback").get(googleCallback);

router
  .route("/user/info")
  .post(authenticateUser.required, getUserInfo)
  .patch(authenticateUser.required, addUserInfo); // get user's info & update user info
router.route("/user/logout").post(authenticateUser.required, logout); // logout
router.route("/user/forgot-password").post(forgotPassword); // send resetlink to email
router.route("/user/reset-password").post(resetPassword); // reset password

router.route("/user/check-login").get(authenticateUser.required, checkLogin); // check if user login
router.route("/user/navbar").get(authenticateUser.required, getNavbarInfo); // get navbar info
router.route("/users").get(authenticateUser.required, getAllUsers);
router
  .route("/user/chatRooms/:userId")
  .get(authenticateUser.required, getAllChat);
router.route("/csrf-token").get(authenticateUser.required, getCSRF);

export default router;
