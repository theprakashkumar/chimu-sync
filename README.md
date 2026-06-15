# Chimu Sync - Collaborative Project Management Platform

A modern, full-stack project management application built with the MERN stack, designed to help teams collaborate effectively on projects and tasks.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)

## Key Features

### Authentication & Security

- **Email & Password Authentication** - Registration and login with hashed passwords
- **JWT + HTTP-only cookies** - Access and refresh tokens; MFA challenge cookie for the 2FA step
- **Multi-Factor Authentication (TOTP)** - Optional 2FA setup, verification, and revoke from account settings
- **Email verification** - Verify account email after signup
- **Password reset** - Forgot password and reset flows via email
- **Role-based Access Control** - Granular permissions system

### Workspace Management

- **Multi-Workspace Support** - Create and manage multiple workspaces
- **Workspace Switching** - Easy navigation between different workspaces
- **Workspace Analytics** - Comprehensive insights and metrics
- **Workspace Settings** - Customizable workspace configurations

### Task Management

- **Complete Task CRUD** - Create, Read, Update, Delete tasks
- **Task Status Management** - Track progress with status updates
- **Priority Levels** - Set and manage task priorities
- **Assignee System** - Assign tasks to team members
- **Task Filtering** - Advanced filtering by status, priority, assignee
- **Task Search** - Quick search functionality

### Team Collaboration

- **Role-based Permissions**
  - **Owner** - Full workspace control
  - **Admin** - Administrative privileges
  - **Member** - Standard collaboration access
- **Member Invitations** - Invite users to workspaces via email
- **Member Management** - Add, remove, and manage team members
- **Permission Guards** - Secure access control

### Advanced Features

- **Smart Filtering** - Filter by status, priority, assigned user
- **Search Functionality** - Find tasks and projects quickly
- **Pagination** - Efficient data loading
- **Load More** - Progressive content loading
- **Responsive Design** - Mobile-friendly interface

### Session Management

- **Secure Logout** - Proper session termination
- **Refresh tokens** - Rotate access tokens via `GET .../auth/refresh`
- **Device sessions** - List and revoke sessions on the account page
- **Session Persistence** - Maintain user state across requests

### Development Features

- **Turborepo monorepo** - Shared scripts to run, build, and lint all apps from the root
- **pnpm workspaces** - Dependencies and package scripts are managed from the repository root
- **Data Seeding** - Pre-populated test data
- **Mongoose Transactions** - Robust data integrity
- **Error Handling** - Comprehensive error management
- **TypeScript** - Type-safe development

## Tech Stack

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

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Shadcn/ui** - Component library
- **React Query** - Data fetching
- **React Router** - Navigation
- **Axios** - HTTP client

### Monorepo & Development

- **Turborepo** - Task orchestration across apps
- **pnpm workspaces** - Package management for the monorepo
- **Vite** - Frontend build tool
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Docker** - Local MongoDB replica set for development
- **Vercel** - Frontend deployment (with API proxy to backend)

## Monorepo Structure

This project is a [Turborepo](https://turbo.build/) monorepo managed with [pnpm workspaces](https://pnpm.io/workspaces).

| Path           | Package   | Description                  |
| -------------- | --------- | ---------------------------- |
| `apps/backend` | `backend` | Express API                  |
| `apps/client`  | `client`  | React + Vite frontend        |
| `packages/*`   | —         | Reserved for shared packages |

Root scripts delegate to Turbo and filter by app when needed.

| Command            | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `pnpm dev`         | Start all app dev servers through Turbo                         |
| `pnpm dev:backend` | Start MongoDB with Docker Compose, then run the API dev server  |
| `pnpm dev:client`  | Start the Vite client dev server                                |
| `pnpm build`       | Build all apps                                                  |
| `pnpm lint`        | Lint all apps that define a `lint` script                       |
| `pnpm start`       | Run production start tasks; currently starts the built backend   |

Package-specific scripts can also be run with pnpm filters, for example:

```bash
pnpm --filter backend seed
pnpm --filter client preview
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** (the repo pins `pnpm@11.5.2` in root `package.json`)
- **Docker Desktop** - Required for the backend dev script (starts MongoDB locally)
- **MongoDB** - Only needed if you are not using the bundled Docker setup

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chimu-sync
   ```

2. **Install dependencies** (from the repo root)

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/client/example.env apps/client/.env
   ```

   Backend variables live in `apps/backend/.env`. Set values for MongoDB, JWT secrets, MFA token settings, SMTP email, Google OAuth, and frontend origins. For the bundled local MongoDB container, a typical URI is:

   ```env
   MONGO_URI="mongodb://localhost:27017/chimu?replicaSet=rs0"
   PORT="8080"
   BASE_PATH="/api"
   FRONTEND_ORIGIN="http://localhost:5173"
   ```

   Client variables live in `apps/client/.env`. Point `VITE_API_BASE_URL` at the backend API, for example:

   ```env
   VITE_API_BASE_URL="http://localhost:8080/api"
   ```

4. **Database**

   Running `pnpm dev:backend` automatically starts MongoDB via Docker Compose, initializes the `rs0` replica set when needed, waits for it to become primary, and then starts the API. The compose file lives at `apps/backend/docker-compose.yml`.

   To start MongoDB manually:

   ```bash
   cd apps/backend
   docker compose -p chimu-mongo-dev up -d
   ```

5. **Seed roles (optional)**

   ```bash
   pnpm --filter backend seed
   ```

6. **Start development servers**

   ```bash
   # Both apps (from repo root)
   pnpm dev

   # Or run one app at a time
   pnpm dev:backend
   pnpm dev:client
   ```

## Project Structure

```
chimu-sync/
├── apps/
│   ├── backend/                 # Node.js/Express API
│   │   ├── src/
│   │   │   ├── controllers/     # Route controllers
│   │   │   ├── models/          # Mongoose models
│   │   │   ├── routes/          # API routes (auth, mfa, session, …)
│   │   │   ├── services/        # Business logic
│   │   │   ├── middlewares/     # Custom middlewares
│   │   │   ├── scripts/         # Dev helpers (Docker + Mongo startup)
│   │   │   └── utils/           # Utility functions
│   │   ├── docker-compose.yml   # Local MongoDB replica set
│   │   └── package.json
│   └── client/                  # React frontend
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── hooks/           # Custom hooks
│       │   ├── page/            # Page components
│       │   ├── routes/          # Routing configuration
│       │   └── types/           # TypeScript types
│       ├── vercel.json          # SPA + API proxy rewrites
│       └── package.json
├── packages/                    # Shared packages (future)
├── package.json                 # Root scripts (Turbo)
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Deployment

- **Backend** - Intended for Render. The backend package includes `pnpm --filter backend deploy`, which calls the Render CLI for the configured service.
- **Frontend** - Intended for Vercel. `apps/client/vercel.json` rewrites `/api/*` requests to the Render backend and falls back to `index.html` for SPA routes.
- There is no GitHub Actions workflow checked in at the moment; deployment is driven by package scripts and platform configuration.

## API Endpoints

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

### User

- `GET /api/user/current` - Current authenticated user (JWT required)

### Workspaces, projects, tasks, members

All routes in this group require JWT authentication.

#### Workspaces

- `POST /api/workspace/create/new` - Create workspace
- `GET /api/workspace/all` - List workspaces for the current user
- `GET /api/workspace/:id` - Get workspace details
- `PUT /api/workspace/update/:id` - Update workspace
- `DELETE /api/workspace/delete/:id` - Delete workspace
- `GET /api/workspace/members/:id` - List workspace members
- `GET /api/workspace/analytics/:id` - Workspace analytics
- `PUT /api/workspace/change/member/role/:id` - Change a member role

#### Projects

- `POST /api/project/workspace/:workspaceId/create` - Create project
- `GET /api/project/workspace/:workspaceId/all` - List projects in a workspace
- `GET /api/project/:id/workspace/:workspaceId` - Get project details
- `GET /api/project/:id/workspace/:workspaceId/analytics` - Project analytics
- `PUT /api/project/:id/workspace/:workspaceId/update` - Update project
- `DELETE /api/project/:id/workspace/:workspaceId/delete` - Delete project

#### Tasks

- `POST /api/task/project/:projectId/workspace/:workspaceId/create` - Create task
- `GET /api/task/workspace/:workspaceId/all` - List tasks in a workspace
- `GET /api/task/:id/project/:projectId/workspace/:workspaceId` - Get task details
- `PUT /api/task/:id/project/:projectId/workspace/:workspaceId/update` - Update task
- `DELETE /api/task/:id/workspace/:workspaceId/delete` - Delete task

#### Members

- `POST /api/member/workspace/:inviteCode/join` - Join a workspace by invite code
