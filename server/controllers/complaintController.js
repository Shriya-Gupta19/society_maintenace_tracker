const Complaint = require("../models/complaint");
const { refreshOverdueFlags } = require("../utils/overdueChecker");

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const complaint = await Complaint.create({
      title,
      category,
      description,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
      resident: req.user.id,
      history: [
        {
          status: "Open",
          note: "Complaint Created",
          changedBy: req.user.id,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Complaints
const getMyComplaints = async (req, res) => {
  try {
    await refreshOverdueFlags();

    const complaints = await Complaint.find({
      resident: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Complaint
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("history.changedBy", "name role");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const isOwner = complaint.resident.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this complaint",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
};