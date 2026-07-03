const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getAllComplaints,
  updateComplaintStatus,
  updatePriority,
  getDashboardStats,
  exportComplaintsReport,
} = require("../controllers/adminController");

router.get("/dashboard", protect, adminOnly, getDashboardStats);

router.get("/complaints", protect, adminOnly, getAllComplaints);

router.get("/reports/complaints", protect, adminOnly, exportComplaintsReport);

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