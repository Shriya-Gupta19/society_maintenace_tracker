const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} = require("../controllers/complaintController");

const handleUpload = (req, res, next) => {
  upload.single("photo")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next();
  });
};

router.post("/", protect, handleUpload, createComplaint);

router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);

module.exports = router;
