const Complaint = require("../models/Complaint");

// Get All Complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("resident", "name email flatNumber")
      .sort({ createdAt: -1 });

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

// Update Complaint Status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    complaint.history.push({
      status,
      note: `Status changed to ${status}`,
      changedBy: req.user.id,
    });

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Priority
const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.priority = priority;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Priority updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const open = await Complaint.countDocuments({ status: "Open" });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    const highPriority = await Complaint.countDocuments({
      priority: "High",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalComplaints,
        open,
        inProgress,
        resolved,
        highPriority,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllComplaints,
  updateComplaintStatus,
  updatePriority,
  getDashboardStats,
};