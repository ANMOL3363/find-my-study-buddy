

import BuddyRequest from "../models/BuddyRequest.js";
import User from "../models/User.js";

export const createBuddyRequest = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId) {
    throw new Error("You cannot send a request to yourself");
  }

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new Error("User not found");
  }

  const existingRequest = await BuddyRequest.findOne({
    sender: senderId,
    receiver: receiverId,
    status: "pending"
  });

  if (existingRequest) {
    throw new Error("Request already sent");
  }

  await BuddyRequest.create({
    sender: senderId,
    receiver: receiverId
  });
};

export const acceptBuddyRequestService = async (requestId, userId) => {
  const request = await BuddyRequest.findById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.receiver.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  if (request.status !== "pending") {
    throw new Error("Request already processed");
  }

  request.status = "accepted";

  await request.save();

  await User.findByIdAndUpdate(request.sender, {
    $addToSet: {
      studyBuddies: request.receiver
    }
  });

  await User.findByIdAndUpdate(request.receiver, {
    $addToSet: {
      studyBuddies: request.sender
    }
  });
};

export const getReceivedRequestsService = async (userId) => {
  return await BuddyRequest.find({
    receiver: userId,
    status: "pending"
  })
    .populate("sender", "fullName email college course year profilePic")
    .sort({ createdAt: -1 });
};

export const rejectBuddyRequestService = async (requestId, userId) => {
  const request = await BuddyRequest.findById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.receiver.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  if (request.status !== "pending") {
    throw new Error("Request already processed");
  }

  request.status = "rejected";

  await request.save();
};

export const cancelBuddyRequestService = async (requestId, userId) => {
  const request = await BuddyRequest.findById(requestId);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.sender.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be cancelled");
  }

  await BuddyRequest.findByIdAndDelete(requestId);
};