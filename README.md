# Chat App

A full-stack real-time chat application with authentication, direct messaging, and profile management.

This repository is **public** and intended as a learning/reference project as well as a usable real-time chat app.

## Tech Stack

### Backend
- **Node.js** + **Express** — REST API
- **Socket.io** — Real-time messaging and online presence
- **MongoDB** + **Mongoose** — Database
- **JWT** — Authentication (HTTP-only cookies)
- **bcryptjs** — Password hashing
- **Cloudinary** — Image uploads (e.g. avatars)
- **Sharp** — Image processing
- **dotenv** — Environment variables
- **cors** + **cookie-parser** — CORS and cookie handling

### Frontend
- **React 19** + **Vite**
- **Redux Toolkit** — State management
- **React Router v7** — Routing
- **Socket.io Client** — Real-time connection
- **Tailwind CSS v4** + **DaisyUI** — Styling
- **React Hook Form** — Forms
- **React Hot Toast** — Notifications
- **Lucide React** — Icons

## Features

- **Auth** — Sign up, login, logout, protected routes
- **Real-time chat** — Send and receive messages via Socket.io
- **Online users** — See who is online
- **User sidebar** — List users and open conversations
- **Profile** — View and update profile (e.g. avatar)
- **Settings** — App settings (e.g. theme)
- **Production** — Serves frontend build and API from one server

## Project Structure

```
chat-app/
├── backend/
│   └── src/
│       ├── index.js           # Entry, Express app, routes
│       ├── controllers/       # auth, message
│       ├── models/            # user, message
│       ├── routes/            # auth, message
│       ├── middleware/        # auth (JWT)
│       └── lib/               # db, socket.io, cloudinary, utils
├── frontend/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── Redux/             # store, auth & messages API/slices
│       ├── libs/              # socket client
│       ├── utils/             # formatDate, interceptor
│       └── constants/
├── package.json               # Root scripts (build, start)
└── README.md
```

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for profile images)

## Environment Variables

### Backend (`backend/.env`)

Create `backend/.env` with:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

For production, also set:

```env
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend

Vite uses `import.meta.env.MODE`. In development the app expects the API at `http://localhost:5001` and the socket at the same origin. For a custom backend URL, use a `.env` or `.env.development` with `VITE_API_URL` (and update `frontend/src/utils/interceptor.js` and `frontend/src/libs/socket.js` if you add that variable).

> **Security note (public repo)**  
> Never commit `.env` files, JWT secrets, API keys, or any private credentials. The sample values below are **placeholders only**.

## Installation

From the project root:

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

Or use the root build script (installs both and builds frontend):

```bash
npm run build
```

## Running the App

### Development

Run backend and frontend in two terminals.

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

Runs with nodemon on `http://localhost:5001` (or your `PORT`).

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

Runs Vite on `http://localhost:5173`.

Use the app at `http://localhost:5173`; it will call the API and socket at `http://localhost:5001`.

### Production

1. Set production env vars (including `NODE_ENV=production` and `FRONTEND_URL` if needed).
2. Build and start from root:

```bash
npm run build
npm start
```

This builds the frontend and starts the backend, which serves the API and the built frontend (e.g. `backend/../frontend/dist`). Open the app at `http://localhost:5001` (or your `PORT`).

## Scripts

| Where      | Script              | Description                                  |
|-----------|---------------------|----------------------------------------------|
| Root      | `npm run build`     | Install backend + frontend, build frontend   |
| Root      | `npm start`         | Start backend (production)                   |
| Backend   | `npm run dev`       | Start backend with nodemon                   |
| Backend   | `npm start`         | Start backend (node)                         |
| Frontend  | `npm run dev`       | Start Vite dev server                        |
| Frontend  | `npm run build`     | Vite production build                        |
| Frontend  | `npm run preview`   | Preview production build                     |

## API Overview

### Auth (`/api/auth`)

| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | `/signup`          | No   | Register user      |
| POST   | `/login`           | No   | Login              |
| POST   | `/logout`          | No   | Logout             |
| GET    | `/check`           | Yes  | Check auth (JWT)   |
| PUT    | `/update`          | Yes  | Update profile     |
| GET    | `/getAllUsers`     | Yes  | List users         |
| GET    | `/getUserById/:id` | Yes  | Get user by ID     |
| DELETE | `/deleteUser/:id`  | Yes  | Delete user        |

### Messages (`/api/messages`)

| Method | Endpoint      | Auth | Description           |
|--------|---------------|------|-----------------------|
| GET    | `/users`      | Yes  | Users for sidebar     |
| GET    | `/:id`        | Yes  | Messages with user ID |
| POST   | `/send/:id`   | Yes  | Send message to user  |

Protected routes use the `protectRoute` middleware (JWT from cookies).

## Socket.io Events

- **Connection** — Client sends `userId` in query; server tracks online users.
- **getOnlineUsers** — Server emits list of online user IDs to all clients.
- **disconnect** — Server removes user from online list and re-emits.

Real-time message delivery may be implemented via additional events in `backend/src/lib/socket.io.js` and the message controller.

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

Please avoid submitting any secrets or credentials in issues, PRs, or commit history.

## License

ISC — see the `LICENSE` file if present, or the `license` field in `package.json`.
