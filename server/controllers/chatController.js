
import {
  sendMessageService,
  getConversationService
} from "../services/chatService.js";

export const sendMessage = async (req, res) => {
  try {
    const message = await sendMessageService(
      req.user._id,
      req.params.receiverId,
      req.body.message
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message
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