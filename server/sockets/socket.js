

import {markMessageAsReadService,markMessageAsDeliveredService} from "../services/chatService.js";

const onlineUsers = new Map();

let ioInstance;

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      io.emit("userOnline", {
        userId
      });

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("messageDelivered", async (messageId) => {
      try {
        const message = await markMessageAsDeliveredService(messageId);

        const senderSocketId = onlineUsers.get(
          message.sender.toString()
        );

        if (senderSocketId) {
          io.to(senderSocketId).emit(
            "messageDelivered",
            message
          );
        }
      } catch (error) {
        console.error("Delivery status error:", error.message);
      }
    });

    socket.on("messageRead", async ({ messageId, userId }) => {
      try {
        const message = await markMessageAsReadService(
          messageId,
          userId
        );

        const senderSocketId = onlineUsers.get(
          message.sender.toString()
        );

        if (senderSocketId) {
          io.to(senderSocketId).emit(
            "messageRead",
            message
          );
        }
      } catch (error) {
        console.error("Read status error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          io.emit("userOffline", {
            userId
          });

          break;
        }
      }

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );

      console.log("User Disconnected:", socket.id);
    });
  });
};

export const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId);
};

export const getIO = () => ioInstance;