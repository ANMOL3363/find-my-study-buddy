
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      college,
      course,
      year,
      bio,
      subjects,
      studyMode,
      location,
    } = req.body;

    const user = await User.findById(req.user._id);

    user.fullName = fullName ?? user.fullName;
    user.college = college ?? user.college;
    user.course = course ?? user.course;
    user.year = year ?? user.year;

    user.bio = bio ?? user.bio;
    user.subjects = subjects ?? user.subjects;
    user.studyMode = studyMode ?? user.studyMode;
    user.location = location ?? user.location;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const {
      subject,
      college,
      course,
      year,
      studyMode,
      location,
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      _id: { $ne: req.user._id }
    };

    if (subject) {
      query.subjects = {
        $regex: subject,
        $options: "i"
      };
    }

    if (college) {
      query.college = {
        $regex: college,
        $options: "i"
      };
    }

    if (course) {
      query.course = {
        $regex: course,
        $options: "i"
      };
    }

    if (year) {
      query.year = Number(year);
    }

    if (studyMode) {
      query.studyMode = studyMode;
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i"
      };
    }

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};