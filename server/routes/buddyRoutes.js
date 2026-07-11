
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  sendBuddyRequest,
  getReceivedRequests,
  acceptBuddyRequest
} from "../controllers/buddyController.js";

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendBuddyRequest);

router.get("/requests", authMiddleware, getReceivedRequests);

router.patch( "/accept/:requestId",authMiddleware,acceptBuddyRequest);

export default router;