
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {sendMessage,getConversation,getChatList} from "../controllers/chatController.js";


const router = express.Router();

router.post("/send/:receiverId",authMiddleware,sendMessage);
router.get("/conversation/:receiverId",authMiddleware,getConversation);
router.get("/chats",authMiddleware,getChatList);

export default router;