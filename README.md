# Student Task Manager

A full-stack task management application for students, built with React, Node.js, Express, and MongoDB.

## Features
- Create, Read, Update, Delete (CRUD) tasks
- Filter by status (All, Pending, Completed)
- Sort by Priority, Due Date, or Creation Date
- Responsive UI with Tailwind CSS
- In-memory data storage fallback (if MongoDB is not available)

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Icons, date-fns
- **Backend:** Node.js, Express, MongoDB (Mongoose)

## Prerequisites
- Node.js installed
- MongoDB installed (optional, app falls back to in-memory storage if not connected)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd StudentManagement
    ```

2.  **Install dependencies:**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3.  **Configuration:**
    - Create a `.env` file in the `backend` directory:
      ```env
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/student-task-manager
      ```

4.  **Run the application:**

    - **Backend:**
      ```bash
      cd backend
      npm run dev
      ```
      The server will start on `http://localhost:5000`.

    - **Frontend:**
      ```bash
      cd frontend
      npm run dev
      ```
      The application will be available at `http://localhost:5173`.

## API Endpoints
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a single task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment
- **Frontend:** Deploy to Vercel/Netlify
- **Backend:** Deploy to Render/Heroku

## Notes
- If MongoDB is not running, the backend will log "Falling back to In-Memory storage" and will store tasks in memory (data will be lost on server restart).
