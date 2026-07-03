const Notice = require("../models/notice");
const User = require("../models/user");
const { sendImportantNoticeEmail } = require("../utils/emailService");

// Create Notice (Admin)
const createNotice = async (req, res) => {
  try {
    const { title, content, important } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and content",
      });
    }

    const notice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
      important: Boolean(important),
      postedBy: req.user.id,
    });

    if (notice.important) {
      const residents = await User.find({ role: "resident" }).select(
        "email name"
      );
      await sendImportantNoticeEmail(residents, notice);
    }

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Notices
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("postedBy", "name")
      .sort({ important: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
};
