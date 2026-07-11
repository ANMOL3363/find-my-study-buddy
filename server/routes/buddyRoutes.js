
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  sendBuddyRequest,
  getReceivedRequests
} from "../controllers/buddyController.js";

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendBuddyRequest);

router.get("/requests", authMiddleware, getReceivedRequests);

export default router;