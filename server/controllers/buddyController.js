
import BuddyRequest from "../models/BuddyRequest.js";
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

    const receiver = await User.findById(userId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingRequest = await BuddyRequest.findOne({
      sender: req.user._id,
      receiver: userId,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent"
      });
    }

    await BuddyRequest.create({
      sender: req.user._id,
      receiver: userId
    });

    res.status(201).json({
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

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      receiver: req.user._id,
      status: "pending"
    })
      .populate("sender", "fullName email college course year profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};