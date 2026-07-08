
import User from "../models/User.js";

export const sendBuddyRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself"
      });
    }

    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(userId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (sender.studyBuddies.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already a study buddy"
      });
    }

    if (sender.sentRequests.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Request already sent"
      });
    }

    sender.sentRequests.push(userId);
    receiver.receivedRequests.push(sender._id);

    await sender.save();
    await receiver.save();

    res.status(200).json({
      success: true,
      message: "Buddy request sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};