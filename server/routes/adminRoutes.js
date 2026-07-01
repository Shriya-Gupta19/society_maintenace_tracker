const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getAllComplaints,
  updateComplaintStatus,
  updatePriority,
} = require("../controllers/adminController");

router.get("/complaints", protect, adminOnly, getAllComplaints);

router.patch(
  "/complaints/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);

router.patch(
  "/complaints/:id/priority",
  protect,
  adminOnly,
  updatePriority
);

module.exports = router;