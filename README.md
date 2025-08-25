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

- **Google OAuth Integration** - Seamless sign-in with Google accounts
- **Email & Password Authentication** - Traditional login system
- **JWT Token Management** - Secure session handling
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
- **Session Persistence** - Maintain user state
- **Auto-logout** - Automatic session expiry

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
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
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

   - Copy `.env.example` to `.env` in both backend and client directories
   - Configure your environment variables

5. **Database Setup**

   ```bash
   cd backend
   npm run seed
   ```

6. **Start Development Servers**

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
│   │   ├── routes/         # API routes
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

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout

### Workspaces

- `GET /api/workspaces` - Get user workspaces
- `POST /api/workspaces` - Create workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Projects

- `GET /api/workspaces/:workspaceId/projects` - Get projects
- `POST /api/workspaces/:workspaceId/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/projects/:projectId/tasks` - Get tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Members

- `GET /api/workspaces/:id/members` - Get workspace members
- `POST /api/workspaces/:id/members/invite` - Invite member
- `DELETE /api/workspaces/:id/members/:memberId` - Remove member
