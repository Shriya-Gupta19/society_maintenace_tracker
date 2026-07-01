const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createNotice,
  getAllNotices,
} = require("../controllers/noticeController");

// Admin
router.post("/", protect, adminOnly, createNotice);

// Resident & Admin
router.get("/", protect, getAllNotices);

module.exports = router;