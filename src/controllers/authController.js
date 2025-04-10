const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");


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

  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError("Enter valid inputs", 400, errors.array());
  }

  // Check if email or username already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new CustomError("An account already exists for this email address.", 400);
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create and save the user
  const newUser = new User({
    email,
    username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({
      userId: newUser._id,
      message: "User registered successfully",
    });
  } catch (err) {
    throw new CustomError("Server error during registration", 500);
  }
});



// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError("Enter valid Inputs", 400, errors.array());
  }

  try {
    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User doesn't exist", 401);
    }

    // Step 2: Compare password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Step 3: Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Step 4: Send response with token
    res.status(200).json({ token });
  } catch (err) {
    // Handle known errors (CustomError)
    if (err instanceof CustomError) {
      res.status(err.statusCode || 400).json({ message: err.message });
    } else {
      // Catch other errors (e.g., server errors)
      console.error(err);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});


// @desc    Logout a user
// @route   POST /api/auth/logout

const logoutUser = asyncHandler(async (req, res) => {

  try {
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unexpected error, Please try again later." });
  }
});

const sendPasswordResetEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
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
      return res.status(404).json({ message: "User not found" });
    }

    // Delete existing token if it exists
    await PasswordResetToken.deleteMany({ userId: user._id });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt,
    });

    await sendPasswordResetEmail(user, rawToken); // send raw token via email

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetTokenDoc = await PasswordResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!resetTokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(resetTokenDoc.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.body; // The access token sent by the frontend

  if (!accessToken) {
    throw new CustomError("Access token is required", 400); // Directly throw error
  }

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
});


// check about custome error handling sing we are using it here      in the above functions.

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  googleLogin,
};
