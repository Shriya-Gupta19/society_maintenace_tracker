const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} = require("../controllers/complaintController");

router.post(
  "/",
  protect,
  upload.single("photo"),
  createComplaint
);

router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);

module.exports = router;