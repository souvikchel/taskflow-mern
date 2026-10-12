# TaskFlow

TaskFlow is a task management app with a React/Vite dashboard and an Express API backed by MongoDB.

## Requirements

- Node.js 20 or newer
- npm
- MongoDB running locally, or a MongoDB connection URI

## Configure the server

Install server dependencies and create a private environment file:

```powershell
cd server
npm install
New-Item .env
```

Set `MONGODB_URI` in `server/.env` to your local MongoDB URI or MongoDB Atlas connection string. You can also set `PORT` (defaults to `5000`) and `CLIENT_ORIGIN` (defaults to `http://localhost:5173`; multiple allowed origins can be comma-separated). Never commit `.env`; it is ignored by Git. Keep credentials in your private local environment file and do not put real connection strings in examples or documentation.

Start the API:

```powershell
npm run dev
```

The API health endpoint is `http://localhost:5000/api/health`.

## Configure the client

In another terminal:

```powershell
cd client
npm install
npm run dev
```

The Vite development server proxies `/api` to `http://localhost:5000`. For a separately hosted API, set `VITE_API_URL` to its API base URL (for example, `https://api.example.com/api`) in the client environment before building.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | API and database status |
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Read one task |
| `PUT` | `/api/tasks/:id` | Update task fields |
| `DELETE` | `/api/tasks/:id` | Delete a task |

Task fields are `title` (required, 1–120 characters), `description` (up to 500 characters), `status` (`todo`, `in-progress`, or `done`), `priority` (`low`, `medium`, or `high`), and `dueDate` (empty or a valid `YYYY-MM-DD` date). Documents include `createdAt` and `updatedAt` timestamps.

## Tests and production build

From the repository root:

```powershell
npm --prefix server test
npm --prefix client run lint
npm --prefix client run build
```

The server tests use `mongodb-memory-server`; its first run downloads a MongoDB binary for the local test database.
