
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendBuddyRequest } from "../controllers/buddyController.js";

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendBuddyRequest);

export default router;