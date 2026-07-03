const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Authentication

router.post("/register", register);

router.post("/login", login);

// Profile

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

// Protected Test Route

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});

module.exports = router;