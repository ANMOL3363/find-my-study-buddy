
import {sendMessageService,getConversationService,getChatListService} from "../services/chatService.js";
import { getReceiverSocketId, getIO } from "../sockets/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const newMessage = await sendMessageService(
      req.user._id,
      req.params.receiverId,
      req.body.message
    );

    const receiverSocketId = getReceiverSocketId(req.params.receiverId);

    if (receiverSocketId) {
      getIO().to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const messages = await getConversationService(
      req.user._id,
      req.params.receiverId
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getChatList = async (req, res) => {
  try {
    const chats = await getChatListService(req.user._id);

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};