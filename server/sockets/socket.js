
const onlineUsers = new Map();

let ioInstance;

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      console.log(`User ${userId} joined`);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log("❌ User Disconnected:", socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

export const getReceiverSocketId = (userId) => {
  return onlineUsers.get(userId);
};

export const getIO = () => ioInstance;