# System Design Write-up

## Complaint History Model

Each complaint stores a `history` array as embedded sub-documents. Every status or priority change appends a record containing the status at that moment, an optional note describing the change, the `changedBy` user reference, and a `changedAt` timestamp. When a resident creates a complaint, an initial history entry is written with status `Open` and note "Complaint Created". When an admin updates status via PATCH, a new entry is pushed with the new status and note. Priority changes also append to history so residents see a complete audit trail on the complaint detail page.

This design keeps history co-located with the complaint document, avoiding joins while preserving chronological order. The frontend renders history as a reverse-chronological timeline.

## Overdue Detection Logic

Overdue is computed from complaint age and priority-based thresholds configured in environment variables (`OVERDUE_DAYS_HIGH=2`, `OVERDUE_DAYS_MEDIUM=5`, `OVERDUE_DAYS_LOW=7`). A scheduled job runs on server startup and every hour to scan all non-resolved complaints. If days since `createdAt` exceed the threshold for that complaint's priority, `overdue` is set to `true`. Resolved complaints always clear the overdue flag.

Overdue complaints are sorted to the top of the admin complaints list, highlighted in red, filterable, and counted on the dashboard. When a complaint newly becomes overdue, an email alert is sent to the resident.

## Photo Handling Process

Residents upload an optional image when filing a complaint. The client sends multipart FormData to `POST /api/complaints`. Multer middleware validates file type (JPEG/PNG) and size (max 5MB), stores the file in `server/uploads/` with a unique filename, and saves the path `/uploads/{filename}` on the complaint document. Express serves uploads as static files. The frontend displays photos using the configurable API base URL.

## Notification Flow

Email uses Nodemailer with SMTP credentials from environment variables. If SMTP is not configured, emails are logged and skipped without breaking API responses.

Three triggers exist:

1. **Status change** — When admin updates complaint status, the resident receives an email with the complaint title and new status.
2. **Important notice** — When admin posts a notice marked important, all residents receive an email with the notice title and content.
3. **Overdue alert** — When overdue detection newly flags a complaint, the resident receives an overdue notification.

This satisfies the requirement for automated email on status changes and important notices using any free-tier SMTP provider (Ethereal, Gmail app password, SendGrid free tier).

## Dashboard and Reporting

The admin dashboard aggregates complaint counts by status, category, and month using MongoDB aggregation. Overdue and in-progress counts are included. Recharts renders status pie chart, category bar chart, and monthly trend line chart. Admins can export a CSV report of all complaints including overdue status, resident details, and timestamps via `GET /api/admin/reports/complaints`.

## Architecture Summary

The application follows a standard MERN-style separation: React SPA communicates with Express REST API over JWT-authenticated requests. Role-based access is enforced on both API middleware (`protect`, `adminOnly`) and frontend route guards. MongoDB stores users, complaints with embedded history, and notices. The system is designed for local development and can be deployed by hosting the API (Render/Railway) and frontend (Vercel) with MongoDB Atlas.
