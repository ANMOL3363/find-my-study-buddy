
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  sendBuddyRequest,
  getReceivedRequests,
  acceptBuddyRequest,
  rejectBuddyRequest,
  cancelBuddyRequest
} from "../controllers/buddyController.js";

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendBuddyRequest);

router.get("/requests", authMiddleware, getReceivedRequests);

router.patch( "/accept/:requestId",authMiddleware,acceptBuddyRequest);

router.patch("/reject/:requestId",authMiddleware,rejectBuddyRequest);

router.delete("/cancel/:requestId",authMiddleware,cancelBuddyRequest);

export default router;