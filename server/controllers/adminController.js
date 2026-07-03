const Complaint = require("../models/complaint");
const { refreshOverdueFlags } = require("../utils/overdueChecker");
const { sendComplaintStatusEmail } = require("../utils/emailService");

const VALID_STATUSES = ["Open", "In Progress", "Resolved"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

// Get All Complaints (overdue pinned at top)
const getAllComplaints = async (req, res) => {
  try {
    await refreshOverdueFlags();

    const complaints = await Complaint.find()
      .populate("resident", "name email flatNumber")
      .sort({ overdue: -1, priority: -1, createdAt: -1 });

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
    const { status, note } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const complaint = await Complaint.findById(req.params.id).populate(
      "resident",
      "name email"
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.status === status) {
      return res.status(400).json({
        success: false,
        message: "Complaint is already in this status",
      });
    }

    complaint.status = status;

    if (status === "Resolved") {
      complaint.overdue = false;
    }

    complaint.history.push({
      status,
      note: note?.trim() || `Status changed to ${status}`,
      changedBy: req.user.id,
    });

    await complaint.save();

    await sendComplaintStatusEmail(
      complaint,
      complaint.resident,
      status
    );

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
    const { priority, note } = req.body;

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority value",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.priority === priority) {
      return res.status(400).json({
        success: false,
        message: "Complaint already has this priority",
      });
    }

    const previousPriority = complaint.priority;
    complaint.priority = priority;

    complaint.history.push({
      status: complaint.status,
      note:
        note?.trim() ||
        `Priority changed from ${previousPriority} to ${priority}`,
      changedBy: req.user.id,
    });

    await complaint.save();
    await refreshOverdueFlags();

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
    await refreshOverdueFlags();

    const totalComplaints = await Complaint.countDocuments();

    const open = await Complaint.countDocuments({
      status: "Open",
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    const highPriority = await Complaint.countDocuments({
      priority: "High",
      status: { $ne: "Resolved" },
    });

    const overdue = await Complaint.countDocuments({
      overdue: true,
      status: { $ne: "Resolved" },
    });

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
    ]);

    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          complaints: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedMonthly = monthlyStats.map((item) => ({
      month: `${months[item._id.month]} ${item._id.year}`,
      complaints: item.complaints,
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        totalComplaints,
        open,
        inProgress,
        resolved,
        highPriority,
        overdue,
      },
      categoryStats,
      monthlyStats: formattedMonthly,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export complaints report as CSV
const exportComplaintsReport = async (req, res) => {
  try {
    await refreshOverdueFlags();

    const complaints = await Complaint.find()
      .populate("resident", "name email flatNumber")
      .sort({ overdue: -1, createdAt: -1 });

    const headers = [
      "Title",
      "Category",
      "Status",
      "Priority",
      "Overdue",
      "Resident",
      "Flat",
      "Created",
      "Updated",
    ];

    const rows = complaints.map((item) => [
      item.title,
      item.category,
      item.status,
      item.priority,
      item.overdue ? "Yes" : "No",
      item.resident?.name || "",
      item.resident?.flatNumber || "",
      new Date(item.createdAt).toISOString(),
      new Date(item.updatedAt).toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="complaints-report.csv"'
    );
    res.status(200).send(csv);
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
  exportComplaintsReport,
};
