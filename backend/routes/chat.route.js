import express from "express";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/auth.middleware.js";
import {
  createChat,
  toggleNotiChat,
  getAllChatRooms,
  joinChatRoom,
} from "../controllers/chat.controller.js";
const router = express.Router();

router.route("/chat").post(authenticateUser.required, createChat);
router.route("/chat/join").patch(authenticateUser.required, joinChatRoom);
router.route("/chat/noti").patch(authenticateUser.required, toggleNotiChat);
router.route("/chats").get(authenticateUser.required, getAllChatRooms);

export default router;
