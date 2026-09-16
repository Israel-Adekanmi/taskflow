# TaskFlow

TaskFlow is a full-stack task management application that allows authenticated users to create, manage, update, and track their tasks.

## Live Demo

* **Frontend:** `https://taskflowfrontend-ten.vercel.app/`
* **Backend API:** `https://taskflow-backend-vqny.onrender.com/`
* **API Documentation:** `https://taskflow-backend-vqny.onrender.com/api/docs`

## Features

* User registration and login
* JWT-based authentication
* Create tasks
* View all personal tasks
* View individual task details
* Update task information
* Update task status
* Delete tasks
* Filter tasks by status
* Overdue task detection
* Responsive user interface
* Swagger API documentation

## Task Statuses

Tasks have three possible statuses:

* `pending`
* `in-progress`
* `completed`

Overdue is not stored as a task status. A task is considered overdue when its due date has passed and it has not been completed.

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* NestJS
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* class-validator
* Swagger

## Project Structure

```text
taskflow/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.ts
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the development server:

```bash
npm run start:dev
```

The backend will run at:

```text
http://localhost:3000
```

### Backend Production Build

```bash
npm run build
```

Start the production server:

```bash
npm run start:prod
```

## Backend API

### Authentication

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/auth/signup` | Register a new user |
| POST   | `/auth/login`  | Login a user        |

### Tasks

All task endpoints require a valid JWT access token.

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/tasks`                    | Create a task         |
| GET    | `/tasks`                    | Get the user's tasks  |
| GET    | `/tasks?status=pending`     | Get pending tasks     |
| GET    | `/tasks?status=in-progress` | Get in-progress tasks |
| GET    | `/tasks?status=completed`   | Get completed tasks   |
| GET    | `/tasks?status=overdue`     | Get overdue tasks     |
| GET    | `/tasks/:id`                | Get a specific task   |
| PATCH  | `/tasks/:id`                | Update a task         |
| DELETE | `/tasks/:id`                | Delete a task         |

## Authentication

After successful login, the API returns a JWT access token.

Protected requests should include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Create Task

### Request

```http
POST /tasks
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Complete project documentation",
  "description": "Finish the README and API documentation",
  "dueDate": "2026-09-30T23:59:59.000Z"
}
```

New tasks are automatically created with the status:

```text
pending
```

The status does not need to be supplied when creating a task.

## Update Task

### Request

```http
PATCH /tasks/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

Example:

```json
{
  "status": "completed"
}
```

A task can also be updated with its title, description, or due date.

## Overdue Tasks

Overdue status is calculated dynamically by the backend.

A task is overdue when:

```text
dueDate < current time
AND
status != completed
```

This means overdue is a computed property and is not stored in the database as a separate status.

## API Response Format

The API uses a consistent response structure:

```json
{
  "error": false,
  "message": "Request successful",
  "data": {}
}
```

For a list of tasks, `data` contains an array:

```json
{
  "error": false,
  "message": "Tasks retrieved successfully",
  "data": []
}
```

## Swagger Documentation

Interactive API documentation is available through Swagger:

```text
https://taskflow-backend-vqny.onrender.com/api/docs
```

Swagger can be used to test the available API endpoints and authenticated requests.

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite.

## Frontend Production Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Backend

The backend is deployed as a Render Web Service.

Render configuration:

```text
Root Directory: backend
Build Command: npm run build
Start Command: npm run start:prod
```

Required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend

The frontend is deployed on Vercel.

Vercel configuration:

```text
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Required environment variable:

```env
VITE_API_URL=YOUR_RENDER_BACKEND_URL
```

## Security

* Passwords are hashed using bcrypt before storage.
* Authentication uses JWT access tokens.
* Task endpoints are protected by authentication.
* Users can only access and modify their own tasks.
* Environment variables are used for sensitive configuration.
* Secrets and database credentials should not be committed to the repository.

## License

This project was developed as a software engineering assessment project.

````




