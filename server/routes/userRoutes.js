
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  
  getProfile,
  updateProfile,
  searchUsers
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.get("/search", authMiddleware, searchUsers);

export default router;