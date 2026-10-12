# TaskFlow — MERN Stack Task Management Application

A full-stack task management application built with the MERN stack to help users organize tasks, manage priorities, track progress, and monitor their daily workload through a clean and responsive dashboard.

## 📌 Project Overview

TaskFlow is a task management application developed using MongoDB, Express.js, React, and Node.js. It provides an interactive dashboard for creating, viewing, updating, and deleting tasks, with search and filtering functionality to make task management easier.

The project demonstrates full-stack development, REST API integration, database persistence, frontend state management, testing, and Git/GitHub workflows.

## ✨ Key Features

- **Task Management:** Create, view, edit, and delete tasks.
- **Task Priorities:** Organize tasks by Low, Medium, and High priority.
- **Task Status Tracking:** Manage Pending, In Progress, and Completed tasks.
- **Search and Filtering:** Find tasks and filter them by relevant criteria.
- **Dashboard Statistics:** View task totals and progress at a glance.
- **MongoDB Persistence:** Store task data in a MongoDB database.
- **Responsive Interface:** Use the dashboard across desktop and mobile screen sizes.
- **REST API:** Connect the React frontend to the Express backend.
- **Input and Error Handling:** Provide appropriate feedback during application operations.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server and build tooling |
| Node.js | JavaScript runtime |
| Express.js | Backend server and REST API |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Axios | HTTP requests between frontend and backend |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| Git and GitHub | Version control and source-code hosting |
| Code0 / CodeZero | AI-assisted development and debugging |

## 📂 Project Structure

```text
taskflow-mern/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/
│   ├── ...
│   └── package.json
├── .gitignore
└── README.md
```

The `client/` directory contains the React frontend, and `server/` contains the Express backend and database integration. Individual files may differ depending on the final implementation.

## ⚙️ Prerequisites

Before running the application, install:

- [Node.js](https://nodejs.org/) and npm
- A MongoDB database, either MongoDB Atlas or a local MongoDB instance
- Git
- A code editor such as Visual Studio Code

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/souvikchel/taskflow-mern.git
cd taskflow-mern
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a file named `.env` inside the `server/` directory.

Add your own MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your actual connection string. Keep the `.env` file private and never commit database credentials to GitHub.

### 4. Start the backend

From the `server/` directory, run:

```bash
npm run dev
```

If the development script is unavailable, check `server/package.json` for the correct start command.

The backend should start on its configured port, which may be `5000` in the current development setup.

### 5. Install frontend dependencies

Open a second terminal from the project root:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite. In the current development setup, this is `http://localhost:5173/`.

Keep both frontend and backend terminals running while using the application.

## 🧪 Testing and Validation

The project should be validated using the following checks:

- Create a task and confirm it appears in the dashboard.
- Edit a task and verify the updated information.
- Delete a task and confirm it is removed.
- Test task search and filters.
- Refresh the page and verify that database-backed tasks persist.
- Confirm that the backend connects to MongoDB.
- Run the existing backend tests.
- Run the frontend production build.

### Frontend production build

From the `client/` directory:

```bash
npm run build
```

### Backend tests

From the `server/` directory, run the test script defined in `server/package.json`. If it is configured as `test`, use:

```bash
npm test
```

Only report tests as passing when they have actually been run successfully.

## 🤖 Code0 Usage

Code0 was used as an AI-assisted development tool during the development of TaskFlow. It supported implementation, debugging, code review, and validation tasks.

AI-generated suggestions were reviewed and tested during development rather than being accepted without verification.

## 🧠 AI Development Experience

### 1. React Dashboard Development

Used Code0 to help implement and refine the task management dashboard, including task presentation, dashboard statistics, and the user interface.

### 2. REST API Development

Used Code0 to assist with implementing and reviewing backend API functionality for task operations using Node.js and Express.js.

### 3. MongoDB Integration

Used Code0 to assist with database configuration and MongoDB integration, including investigating connection and persistence issues.

### 4. Debugging and Frontend Integration

Used Code0 to investigate issues involving task creation, frontend state updates, and communication between the React application and backend API.

### 5. Testing and GitHub Workflow

Used Code0 to assist with production-build verification, backend test execution, Git status checks, and publishing project changes to GitHub.

These examples describe the development tasks performed during this project. The implementation and results were checked through local testing and Git operations where applicable.

## 🔐 Security Considerations

- Store database credentials in environment variables.
- Do not commit `.env` files or private credentials.
- Exclude `node_modules/` and generated build output from version control.
- Use a restricted database account and appropriate network access rules.
- Validate incoming API data and handle errors appropriately.

## 🔮 Future Improvements

Potential enhancements include:

- User authentication and individual task ownership.
- Task due-date reminders.
- Task sorting and pagination.
- More detailed task analytics.
- Automated integration testing.
- Deployment with production environment configuration.

These are possible future improvements, not claims about existing functionality.

## 👨‍💻 Author

**Souvik**

GitHub: [@souvikchel](https://github.com/souvikchel)

## 📄 License

No license has been specified yet. Add an appropriate license if you intend to distribute or reuse this project publicly.
