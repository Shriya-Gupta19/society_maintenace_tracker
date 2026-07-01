const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to your profile",
    user: req.user,
  });
});

module.exports = router;