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

module.exports = router;
