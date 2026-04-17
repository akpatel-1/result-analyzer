# 🎓 Result Analyzer

> A full-stack web portal for college students to view and analyze their academic performance.
> 🔗 Live Demo: https://result-analyzer-akpatel-1s-projects.vercel.app/student/login
> ⚠️ Note: The backend is hosted on a free tier. It may take up to 30–40 seconds to respond on the first request due to cold start.
---

## 📖 Overview

**Result Analyzer** lets students log in with their college email via OTP and instantly access their academic dashboard — CGPA, backlog status, semester-wise results, and performance charts. Admins get a separate portal to manage student profiles, upload results, and track exam attempt history.

---

## ✨ Features

### 👨‍🎓 Student Portal
- Login via college email + OTP (no password)
- View current CGPA and backlog status
- See latest exam attempt results
- Full semester-wise result history
- Bar chart & pie chart for performance analysis
- Light & Dark mode

### 🔧 Admin Portal
- Secure login via email + password (Redis session)
- View all student profiles and results
- Upload student profiles and semester results
- Track up to **12 attempts** per student per semester
- Light & Dark mode

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Category | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| State Management | Zustand v5 |
| HTTP Client | Axios |
| Charts | Recharts v3 |
| Styling | Tailwind CSS v4 |
| Icons | React Icons v5 |
| Validation | Zod v4 |

### Backend (`server/`)
| Category | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express v5 |
| Database | PostgreSQL (`pg`) |
| Cache / Sessions | Upstash Redis |
| Auth — Student | College Email + OTP + JWT |
| Auth — Admin | Email + Password + Redis Session |
| Password Hashing | Argon2 |
| Email / OTP | Nodemailer |
| Validation | Zod v4 |
| Tokens | jsonwebtoken |

---

## 📁 Project Structure

```
result-analyzer/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── modules/          # Feature modules (student, admin)
│   │   ├── components/       # Shared UI components
│   │   ├── store/            # Zustand state stores
│   │   ├── api/              # Axios instances & API functions
│   │   └── routes/           # React Router config
│   └── package.json
│
└── server/                   # Express backend
    ├── src/
    │   ├── modules/          # Route handlers (admin, student)
    │   ├── infrastructure/   # DB, Redis, mailer setup
    │   ├── middleware/       # Auth & validation middleware
    │   ├── app.ts            # Express app setup
    │   ├── server.ts         # HTTP server
    │   └── index.ts          # Entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database
- Upstash Redis (or local Redis)
- SMTP credentials for OTP emails

### 1. Clone the repo

```bash
git clone https://github.com/akpatel-1/result-analyzer.git
cd result-analyzer
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
# FRONTEND_URL=http://localhost:5173
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/result_analyzer

UPSTASH_REDIS_REST_URL=https://xyz.upstash.io
UPSTASH_REDIS_REST_TOKEN=xyz

OTP_SECRET=xyz
ACCESS_TOKEN_SECRET=xyz

BREVO_API_KEY=xyz
BREVO_FROM_EMAIL=xyz

```

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000/
```

```bash
npm run dev
```

---

## 🔐 Auth Flows

### Student — OTP + JWT
1. Student enters college email
2. Server sends time-limited OTP via Nodemailer
3. Student submits OTP → server validates → issues JWT
4. JWT sent with every request; refresh tokens stored in PostgreSQL

### Admin — Email + Password + Session
1. Admin submits email and password
2. Password verified with Argon2
3. Session created in Redis; cookie sent to client

---

## 🗂️ API Reference

| Method | Endpoint | Description |
| Method | Endpoint                            | Description                    |
| ------ | ----------------------------------- | ------------------------------ |
| `POST` | `/api/student/auth/otp`             | Send OTP to student email      |
| `POST` | `/api/student/auth/otp/verify`      | Verify OTP and issue JWT       |
| `POST` | `/api/student/auth/auth/refresh`    | Refresh JWT                    |
| `POST` | `/api/student/auth/auth/logout`     | Logout student                 |
| `GET`  | `/api/student/auth/me`              | Get authenticated student info |
| `GET`  | `/api/student/profile/profile`      | Student profile                |
| `GET`  | `/api/student/result/latest-result` | Get latest result              |
| `GET`  | `/api/student/result/result`        | Get semester result            |
| `POST` | `/api/admin/auth/login`             | Admin login                    |
| `POST` | `/api/admin/auth/logout`            | Admin logout                   |
| `GET`  | `/api/admin/auth/me`                | Admin profile                  |
| `POST` | `/api/admin/upload/profile`         | Upload student profile         |
| `POST` | `/api/admin/upload/subjects`        | Upload subject info            |
| `POST` | `/api/admin/upload/results`         | Upload results                 |
| `GET`  | `/api/admin/student/profile`        | Get student profile (admin)    |
| `GET`  | `/api/admin/student`                | Get specific student result    |


---

## 📜 Scripts

### Frontend
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

### Backend
```bash
npm run dev       # Start with nodemon (hot reload)
npm start         # Start with node
npm run format    # Prettier format
```

> Built for student academic transparency 🎓
