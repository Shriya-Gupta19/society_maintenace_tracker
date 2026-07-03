const nodemailer = require("nodemailer");

let transporter = null;

function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

function getTransporter() {
  if (!isEmailConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`[Email skipped - SMTP not configured] To: ${to} | ${subject}`);
    return false;
  }

  try {
    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error.message);
    return false;
  }
}

async function sendComplaintStatusEmail(complaint, resident, newStatus) {
  if (!resident?.email) {
    return false;
  }

  return sendEmail({
    to: resident.email,
    subject: `Complaint Update: ${complaint.title}`,
    text: `Hello ${resident.name},\n\nYour complaint "${complaint.title}" status has been updated to "${newStatus}".\n\nThank you,\nSociety Maintenance Tracker`,
    html: `<p>Hello <strong>${resident.name}</strong>,</p><p>Your complaint <strong>${complaint.title}</strong> status has been updated to <strong>${newStatus}</strong>.</p><p>Thank you,<br/>Society Maintenance Tracker</p>`,
  });
}

async function sendImportantNoticeEmail(residents, notice) {
  const emails = residents
    .map((resident) => resident.email)
    .filter(Boolean);

  if (emails.length === 0) {
    return false;
  }

  return sendEmail({
    to: emails.join(","),
    subject: `Important Notice: ${notice.title}`,
    text: `Important society notice:\n\n${notice.title}\n\n${notice.content}`,
    html: `<h2>Important Notice</h2><h3>${notice.title}</h3><p>${notice.content}</p>`,
  });
}

async function sendOverdueAlertEmail(complaint, resident) {
  if (!resident?.email) {
    return false;
  }

  return sendEmail({
    to: resident.email,
    subject: `Overdue Complaint: ${complaint.title}`,
    text: `Hello ${resident.name},\n\nYour complaint "${complaint.title}" is now marked as overdue. Our team is working on it.\n\nThank you,\nSociety Maintenance Tracker`,
    html: `<p>Hello <strong>${resident.name}</strong>,</p><p>Your complaint <strong>${complaint.title}</strong> is now marked as <strong>overdue</strong>.</p>`,
  });
}

module.exports = {
  sendEmail,
  sendComplaintStatusEmail,
  sendImportantNoticeEmail,
  sendOverdueAlertEmail,
  isEmailConfigured,
};
