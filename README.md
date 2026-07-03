# Society Maintenance Tracker

A full-stack platform for apartment society maintenance complaints, notice board communication, and admin reporting.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Axios, Recharts
- **Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT, Multer, Nodemailer
- **Database:** MongoDB

## Project Structure

```
society_maintenance_tracker/
├── client/          # React frontend
├── server/          # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── uploads/     # Complaint photo storage (runtime)
├── README.md
└── SYSTEM_DESIGN.md
```

## Setup Guide

### Prerequisites

- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Client runs at `http://localhost:5173`

### 3. Create Admin User

Register a user normally, then update role in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Features

### Residents
- Register / login
- File complaints (category, description, optional photo)
- Track complaints with full status history
- View notice board with pinned important notices

### Admins
- Dashboard with stats, charts, and CSV export
- Manage complaints (status, priority, overdue pinning)
- Post notices with important/pinned flag
- Overdue detection based on configurable day thresholds

### Notifications (Email)
- Complaint status change → resident email
- Important notice posted → all residents email
- Complaint becomes overdue → resident email

Configure SMTP in `server/.env` (works with Ethereal, Gmail, SendGrid free tier).

## Database Schema

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | unique, required |
| password | String | hashed |
| phone | String | required |
| flatNumber | String | required |
| role | String | `resident` or `admin` |

### Complaint
| Field | Type | Notes |
|-------|------|-------|
| title | String | required |
| category | Enum | Electrical, Plumbing, Cleaning, Security, Parking, Lift, Other |
| description | String | required |
| photo | String | `/uploads/filename` |
| status | Enum | Open, In Progress, Resolved |
| priority | Enum | Low, Medium, High |
| resident | ObjectId | ref User |
| history[] | Array | status, note, changedBy, changedAt |
| overdue | Boolean | auto-computed |

### Notice
| Field | Type | Notes |
|-------|------|-------|
| title | String | required |
| content | String | required |
| important | Boolean | pins to top |
| postedBy | ObjectId | ref User |

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register resident |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/profile` | Bearer | Get profile |
| PUT | `/auth/profile` | Bearer | Update profile |

### Complaints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/complaints` | Bearer | Create complaint (multipart photo) |
| GET | `/complaints/my` | Bearer | Resident's complaints |
| GET | `/complaints/:id` | Bearer | Complaint detail + history |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | Dashboard stats & charts data |
| GET | `/admin/complaints` | Admin | All complaints (overdue first) |
| PATCH | `/admin/complaints/:id/status` | Admin | Update status + history |
| PATCH | `/admin/complaints/:id/priority` | Admin | Update priority + history |
| GET | `/admin/reports/complaints` | Admin | Download CSV report |

### Notices
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/notices` | Admin | Create notice |
| GET | `/notices` | Bearer | List notices (important first) |

## Overdue Detection

Complaints open beyond configurable thresholds are flagged overdue:

| Priority | Default Threshold |
|----------|-------------------|
| High | 2 days |
| Medium | 5 days |
| Low | 7 days |

Configure via `OVERDUE_DAYS_HIGH`, `OVERDUE_DAYS_MEDIUM`, `OVERDUE_DAYS_LOW` in server `.env`.

Overdue complaints are sorted to the top of the admin complaints view and counted on the dashboard.

## Submission Notes

Do **not** include in zip submission:
- `node_modules/`
- `.env` files
- `dist/` or build artifacts
- `.vscode/`

Include:
- Source code
- `.env.example` files
- This README and SYSTEM_DESIGN.md
