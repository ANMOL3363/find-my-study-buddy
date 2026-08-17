
import BuddyRequest from "../models/BuddyRequest.js";

import {
  createBuddyRequest,
  acceptBuddyRequestService,
  getReceivedRequestsService,
  rejectBuddyRequestService,
  cancelBuddyRequestService,
  getSentRequestsService,
  getStudyBuddiesService,
  removeStudyBuddyService
} from "../services/buddyService.js";

export const sendBuddyRequest = async (req, res) => {
  try {
    await createBuddyRequest(
      req.user._id,
      req.params.userId
    );

    res.status(201).json({
      success: true,
      message: "Buddy request sent successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await getReceivedRequestsService(req.user._id);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const acceptBuddyRequest = async (req, res) => {
  try {
    await acceptBuddyRequestService(
      req.params.requestId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Buddy request accepted"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const rejectBuddyRequest = async (req, res) => {
  try {
    await rejectBuddyRequestService(
      req.params.requestId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Buddy request rejected"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const cancelBuddyRequest = async (req, res) => {
  try {
    await cancelBuddyRequestService(
      req.params.requestId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Buddy request cancelled successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const requests = await getSentRequestsService(req.user._id);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudyBuddies = async (req, res) => {
  try {
    const buddies = await getStudyBuddiesService(req.user._id);

    res.status(200).json({
      success: true,
      count: buddies.length,
      buddies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const removeStudyBuddy = async (req, res) => {
  try {
    await removeStudyBuddyService(
      req.user._id,
      req.params.buddyId
    );

    res.status(200).json({
      success: true,
      message: "Study buddy removed successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};