# 🚀 Chimu Sync - Collaborative Project Management Platform

A modern, full-stack project management application built with the MERN stack, designed to help teams collaborate effectively on projects and tasks.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🗝️ Key Features

### 🔐 Authentication & Security

- **Email & Password Authentication** - Registration and login with hashed passwords
- **JWT + HTTP-only cookies** - Access and refresh tokens; MFA challenge cookie for the 2FA step
- **Multi-Factor Authentication (TOTP)** - Optional 2FA setup, verification, and revoke from account settings
- **Email verification** - Verify account email after signup
- **Password reset** - Forgot password and reset flows via email
- **Role-based Access Control** - Granular permissions system

### 🏢 Workspace Management

- **Multi-Workspace Support** - Create and manage multiple workspaces
- **Workspace Switching** - Easy navigation between different workspaces
- **Workspace Analytics** - Comprehensive insights and metrics
- **Workspace Settings** - Customizable workspace configurations

### ✅ Task Management

- **Complete Task CRUD** - Create, Read, Update, Delete tasks
- **Task Status Management** - Track progress with status updates
- **Priority Levels** - Set and manage task priorities
- **Assignee System** - Assign tasks to team members
- **Task Filtering** - Advanced filtering by status, priority, assignee
- **Task Search** - Quick search functionality

### 👥 Team Collaboration

- **Role-based Permissions**
  - **Owner** - Full workspace control
  - **Admin** - Administrative privileges
  - **Member** - Standard collaboration access
- **Member Invitations** - Invite users to workspaces via email
- **Member Management** - Add, remove, and manage team members
- **Permission Guards** - Secure access control

### 🔍 Advanced Features

- **Smart Filtering** - Filter by status, priority, assigned user
- **Search Functionality** - Find tasks and projects quickly
- **Pagination** - Efficient data loading
- **Load More** - Progressive content loading
- **Responsive Design** - Mobile-friendly interface

### 🚪 Session Management

- **Secure Logout** - Proper session termination
- **Refresh tokens** - Rotate access tokens via `GET .../auth/refresh`
- **Device sessions** - List and revoke sessions on the account page
- **Session Persistence** - Maintain user state across requests

### 🌱 Development Features

- **Data Seeding** - Pre-populated test data
- **Mongoose Transactions** - Robust data integrity
- **Error Handling** - Comprehensive error management
- **TypeScript** - Type-safe development
- **API Documentation** - Well-documented endpoints

## 🛠️ Tech Stack

### Backend

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Access, refresh, and MFA challenge tokens
- **cookie-parser** - Cookie-based auth and MFA step-up
- **bcrypt** - Password hashing
- **Nodemailer** - Transactional email (verification, password reset)
- **Speakeasy / QRCode** - TOTP MFA setup
- **Zod** - Request validation
- **TypeScript** - Type safety

### Frontend

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Shadcn/ui** - Component library
- **React Query** - Data fetching
- **React Router** - Navigation
- **Axios** - HTTP client

### Development Tools

- **Vite** - Build tool
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chimu-sync
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   - **Backend:** copy `backend/.env.example` to `backend/.env` and set variables (JWT secrets, `MONGO_URI`, `MFA_*`, SMTP, `FRONTEND_ORIGIN`, `BASE_PATH`, etc.).
   - **Client:** copy `client/example.env` to `client/.env` and point the API URL at your backend.

5. **Database**

   - Use your own MongoDB, or start the local replica set with `docker compose -f backend/docker-compose.yml up -d` (see `backend/docker-compose.yml`). Then run any one-time init your deployment needs (e.g. replica set initiation if required).

6. **Seed roles (optional)**

   ```bash
   cd backend
   npm run seed
   ```

7. **Start Development Servers**

   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from client directory)
   npm run dev
   ```

## 📁 Project Structure

```
chimu-sync/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes (auth, mfa, session, …)
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Custom middlewares
│   │   └── utils/          # Utility functions
│   └── package.json
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

The API is mounted under a configurable prefix (`BASE_PATH`, default `/api`). Paths below use `/api` as an example.

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns MFA challenge cookie when 2FA is enabled)
- `GET /api/auth/refresh` - Refresh access token (uses refresh cookie)
- `POST /api/auth/verify/email` - Verify email with code
- `POST /api/auth/password/forgot` - Request password reset email
- `POST /api/auth/password/reset` - Reset password with code
- `POST /api/auth/logout` - Logout (JWT required)

### MFA

- `GET /api/mfa/setup` - MFA setup payload (QR / secret) (JWT required)
- `POST /api/mfa/verify` - Complete MFA setup with TOTP code (JWT required)
- `POST /api/mfa/revoke` - Disable MFA (JWT required)
- `POST /api/mfa/verify-login` - Complete login after MFA (TOTP + MFA challenge cookie)

### Sessions

- `GET /api/session/all` - List sessions (JWT required)
- `GET /api/session/current` - Current session (JWT required)
- `DELETE /api/session/:id` - Revoke a session (JWT required)

### Workspaces, projects, tasks, members

Protected routes live under `/api/workspace`, `/api/project`, `/api/task`, and `/api/member` (see `backend/src/routes/` for exact paths and handlers).
