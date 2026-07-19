
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import buddyRoutes from "./routes/buddyRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initializeSocket } from "./sockets/socket.js";


import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buddies", buddyRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Study Buddy API is Running...");
});

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

initializeSocket(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});