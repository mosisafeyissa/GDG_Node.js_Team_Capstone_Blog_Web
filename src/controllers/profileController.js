const CustomError = require("../utils/CustomError");
const asyncHandler =require("express-async-handler");
const User = require("../models/User");


const getProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password"); 

    if (!user) {
      return next(new CustomError("User not found", 404)); 
    }

    res.status(200).json({
      userId: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err); 
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {getProfile, updateProfile };