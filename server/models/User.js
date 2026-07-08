
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    college: {
      type: String,
      default: "",
    },

    course: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: 1,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },

    subjects: [
      {
        type: String,
      },
    ],

    studyMode: {
      type: String,
      enum: ["Online", "Offline", "Both"],
      default: "Both",
    },

    location: {
      type: String,
      default: "",
    },
    sentRequests: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  ],

  receivedRequests: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  ],

  studyBuddies: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  ],

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;