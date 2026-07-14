
import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessageService = async (
  senderId,
  receiverId,
  message
) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new Error("Receiver not found");
  }

  const isBuddy = sender.studyBuddies.some(
    (buddy) => buddy.toString() === receiverId
  );

  if (!isBuddy) {
    throw new Error("You can only message your study buddies");
  }

  return await Message.create({
    sender: senderId,
    receiver: receiverId,
    message
  });
};

export const getConversationService = async (
  userId,
  receiverId
) => {
  return await Message.find({
    $or: [
      {
        sender: userId,
        receiver: receiverId
      },
      {
        sender: receiverId,
        receiver: userId
      }
    ]
  }).sort({
    createdAt: 1
  });
};