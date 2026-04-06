# ProMap — Project Management App

A full-stack project management application built with the MERN stack. ProMap allows teams to organize projects, assign tasks, manage members, and track progress in real time.

## Live Demo

- Frontend: https://promap-ebon.vercel.app
- Backend: https://promap-n3qg.onrender.com

## Features

- User authentication (JWT based signup/login)
- Create, update, and delete projects
- Create, assign, and track tasks with priority and due dates
- Role based access control (owner, admin, member)
- Add and remove project members
- Filter and search tasks by status and priority
- Overdue task highlighting
- Responsive design for mobile and desktop

## Tech Stack

**Frontend**
- React (Vite)
- React Router v6
- Axios
- Lucide React (icons)
- CSS Modules

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation
- Helmet, Rate Limiting, CORS

## Project Structure

Project_Manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   └── utils/          # Helper functions
│   └── vercel.json
└── server/                 # Express backend
├── controllers/        # Route handlers
├── middleware/         # Auth, validation, error handling
├── models/             # Mongoose models
├── routes/             # API routes
└── utils/              # Helper utilities

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/`:

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/users/signup | Register a new user |
| POST | /api/v1/users/login | Login |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/projects | Get all projects |
| POST | /api/v1/projects | Create a project |
| GET | /api/v1/projects/:id | Get a project |
| PATCH | /api/v1/projects/:id | Update a project |
| DELETE | /api/v1/projects/:id | Delete a project |
| GET | /api/v1/projects/:id/members | Get project members |
| POST | /api/v1/projects/:id/members | Add a member |
| DELETE | /api/v1/projects/:id/members/:userId | Remove a member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/tasks?projectId= | Get tasks by project |
| POST | /api/v1/tasks | Create a task |
| GET | /api/v1/tasks/:id | Get a task |
| PATCH | /api/v1/tasks/:id | Update a task |
| DELETE | /api/v1/tasks/:id | Delete a task |

Tholkappian Murugesan — [GitHub](https://github.com/TitanThols)
