const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  googleLogin,
} = require("../controllers/authController");
const { updateProfile } = require("../controllers/profileController");


const {
  validateUser,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const {protect, verifyToken } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", validateUser, handleValidationErrors, registerUser);

router.post(
  "/login",
  [
    require("express-validator")
      .body("email")
      .isEmail()
      .withMessage("Valid email is required"),
    require("express-validator")
      .body("password")
      .notEmpty()
      .withMessage("Password is required"),
    handleValidationErrors,
  ],
  loginUser
);

router.post("/logout", verifyToken, logoutUser);

router.post("/reset-password/request", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

// Protected route
router.get("/profile", protect, async (req, res, next) => {
  try {
    // Fetch the user from the database using the userId from the token
    const user = await User.findById(req.user).select("-password"); // Exclude password from the result

    if (!user) {
      return next(new CustomError("User not found", 404)); // User not found
    }

    // Return the user profile data (excluding password)
    res.status(200).json({
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    next(err); // Pass errors to error handler
  }
});

router.put("/profile", protect, updateProfile);

module.exports = router;
