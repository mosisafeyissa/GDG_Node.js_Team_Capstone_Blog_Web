const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const { OAuth2Client } = require("google-auth-library");
const {
  generatePasswordResetToken,
} = require("../services/sendEmail");
const sendEmail = require("../services/sendEmail");
const CustomError = require("../utils/CustomError"); // Import the CustomError class


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Create the user
  const user = await User.create({ email, username, password });

  if (user) {
    res.status(201).json({
      userId: user._id,
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 2. Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 3. Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // 4. Respond with token
  res.status(200).json({ token });
});

const logoutUser = (req, res) => {
  // You could also handle blacklisting the token here if you implement it
  res.status(200).json({ message: "User logged out successfully" });
};

const sendPasswordResetEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your preferred email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a token and store it in the PasswordResetToken collection
    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = Date.now() + 3600000; // 1 hour expiration time

    const resetToken = new PasswordResetToken({
      userId: user._id,
      token,
      expiresAt,
    });

    await resetToken.save();

    // Send the password reset email
    await sendPasswordResetEmail(user, token);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    next(err); // Forward error to error handler
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  // 1. Validate Input: Check if token and new password are provided.
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    // 2. Check if the token exists in the PasswordResetToken collection.
    const resetToken = await PasswordResetToken.findOne({ token });

    if (!resetToken) {
      // Token doesn't exist, send error response
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 3. Check if the token has expired.
    if (resetToken.expiresAt < Date.now()) {
      // Token has expired, send error response
      return res.status(400).json({ message: "Token has expired" });
    }

    // 4. Find the user associated with the token.
    const user = await User.findById(resetToken.userId);
    if (!user) {
      // User not found, send error response
      return res.status(400).json({ message: "User not found" });
    }

    // 5. Hash the new password before saving it.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 6. Update the user's password with the new hashed password.
    user.password = hashedPassword;
    await user.save();

    // 7. Delete the reset token from the database after successful password reset.
    await PasswordResetToken.deleteOne({ token });

    // 8. Respond with success message.
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    next(err); // Pass the error to the error handler
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res, next) => {
  const { accessToken } = req.body; // The access token sent by the frontend

  if (!accessToken) {
    return next(new CustomError("Access token is required", 400));
  }

  try {
    // 1. Verify the access token with Google
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the Google client ID
    });

    // 2. Extract user info from the token
    const payload = ticket.getPayload();
    const { email, name, picture } = payload; // You can add other fields if needed

    // 3. Check if user already exists in your database
    let user = await User.findOne({ email });

    if (!user) {
      // 4. If the user doesn't exist, you can create a new user or throw an error.
      user = new User({
        email,
        username: name, // Set username as user's Google name or something else
        picture, // Optional, store the user's Google profile picture
        google: true, // Add a field indicating that this user signed up via Google
      });
      await user.save(); // Save the new user in the database
    }

    // 5. Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set the expiration as needed
    });

    // 6. Respond with the JWT token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return next(new CustomError("Failed to authenticate with Google", 500));
  }
};




const updateProfile = async (req, res, next) => {
  const { username } = req.body;

  // Validate that username is provided
  if (!username) {
    return next(new CustomError("Username is required", 400)); // Bad request
  }

  try {
    // Find the user in the database and update the username
    const updatedUser = await User.findByIdAndUpdate(
      req.user, // The user ID from the token
      { username }, // Only update the username
      { new: true, runValidators: true } // Return the updated user and run validators
    );

    if (!updatedUser) {
      return next(new CustomError("User not found", 404)); // User not found
    }

    // Return the updated profile
    res.status(200).json({
      updatedProfile: {
        userId: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    next(err); // Pass any errors to error handler
  }
};


// check about custome error handling sing we are using it here      in the above functions.



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  googleLogin,
  updateProfile,
};
