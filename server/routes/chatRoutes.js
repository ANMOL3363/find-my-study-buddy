
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {sendMessage,getConversation} from "../controllers/chatController.js";


const router = express.Router();

router.post("/send/:receiverId",authMiddleware,sendMessage);
router.get("/conversation/:receiverId",authMiddleware,getConversation);

export default router;