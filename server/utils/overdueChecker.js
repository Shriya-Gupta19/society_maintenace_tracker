const Complaint = require("../models/complaint");
const { sendOverdueAlertEmail } = require("./emailService");

const THRESHOLDS = {
  High: Number(process.env.OVERDUE_DAYS_HIGH) || 2,
  Medium: Number(process.env.OVERDUE_DAYS_MEDIUM) || 5,
  Low: Number(process.env.OVERDUE_DAYS_LOW) || 7,
};

function getThresholdDays(priority) {
  return THRESHOLDS[priority] || THRESHOLDS.Low;
}

function daysSince(date) {
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
}

function shouldBeOverdue(complaint) {
  if (complaint.status === "Resolved") {
    return false;
  }

  return daysSince(complaint.createdAt) > getThresholdDays(complaint.priority);
}

async function refreshOverdueFlags() {
  const openComplaints = await Complaint.find({
    status: { $in: ["Open", "In Progress"] },
  }).populate("resident", "email name");

  const newlyOverdue = [];

  for (const complaint of openComplaints) {
    const overdue = shouldBeOverdue(complaint);

    if (complaint.overdue !== overdue) {
      complaint.overdue = overdue;
      await complaint.save();

      if (overdue) {
        newlyOverdue.push(complaint);
        await sendOverdueAlertEmail(complaint, complaint.resident);
      }
    }
  }

  await Complaint.updateMany(
    { status: "Resolved", overdue: true },
    { overdue: false }
  );

  return newlyOverdue;
}

module.exports = {
  getThresholdDays,
  shouldBeOverdue,
  refreshOverdueFlags,
  THRESHOLDS,
};
