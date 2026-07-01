const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createComplaint,
  getMyComplaints,
} = require("../controllers/complaintController");

router.post("/", protect, createComplaint);

router.get("/my", protect, getMyComplaints);

module.exports = router;