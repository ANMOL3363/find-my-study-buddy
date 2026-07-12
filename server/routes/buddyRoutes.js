
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  sendBuddyRequest,
  getReceivedRequests,
  getSentRequests,
  acceptBuddyRequest,
  rejectBuddyRequest,
  cancelBuddyRequest,
  getStudyBuddies,
  removeStudyBuddy
} from "../controllers/buddyController.js";

const router = express.Router();

router.post("/request/:userId", authMiddleware, sendBuddyRequest);

router.get("/requests", authMiddleware, getReceivedRequests);

router.patch( "/accept/:requestId",authMiddleware,acceptBuddyRequest);

router.patch("/reject/:requestId",authMiddleware,rejectBuddyRequest);

router.delete("/cancel/:requestId",authMiddleware,cancelBuddyRequest);

router.get("/sent",authMiddleware,getSentRequests);

router.get("/list",authMiddleware,getStudyBuddies);

router.delete("/remove/:buddyId",authMiddleware,removeStudyBuddy);

export default router;