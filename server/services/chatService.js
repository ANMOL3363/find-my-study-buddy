
import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";

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



export const getChatListService = async (userId) => {
  return await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { receiver: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $group: {
        _id: {
          $cond: [
            {
              $eq: ["$sender", new mongoose.Types.ObjectId(userId)]
            },
            "$receiver",
            "$sender"
          ]
        },
        lastMessage: {
          $first: "$message"
        },
        lastMessageTime: {
          $first: "$createdAt"
        },
        isRead: {
          $first: "$isRead"
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: "$user._id",
        fullName: "$user.fullName",
        email: "$user.email",
        profilePic: "$user.profilePic",
        lastMessage: 1,
        lastMessageTime: 1,
        isRead: 1
      }
    },
    {
      $sort: {
        lastMessageTime: -1
      }
    }
  ]);
};