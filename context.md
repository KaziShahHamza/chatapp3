# ChatApp3 – Project Context

A full-stack real-time chat application with a React + Vite frontend and an Express + Socket.IO + MongoDB backend. This document captures architecture, key flows, APIs, data models, environment, and how to run the app locally.

## Overview
- Real-time messaging via Socket.IO
- Persistent chat history in MongoDB
- Simple JWT-based login; token stored in `localStorage`
- Basic protected routes on the client (no server-side auth guard on message routes)

## Tech Stack
- Frontend: React 19, React Router 7, Vite 7, Tailwind CSS 4, Socket.IO Client
- Backend: Node.js (ESM), Express 5, Socket.IO 4, Mongoose 9, bcryptjs, jsonwebtoken, dotenv, cors
- DB: MongoDB

## Repository Structure
```
AI_CHAT_PROMPT.md
client/
  eslint.config.js
  index.html
  package.json
  README.md
  vite.config.js
  public/
  src/
    App.jsx
    index.css
    main.jsx
    components/
      ChatHeader.jsx
      MessageInput.jsx
      MessageList.jsx
    context/
      AuthContext.js
    pages/
      Chat.jsx
      Dashboard.jsx
      Login.jsx
      Signup.jsx
    services/
      auth.js
      socket.js
server/
  index.js
  package.json
  config/
    db.js
  controllers/
    auth.controller.js
  models/
    Message.js
    User.js
  routes/
    auth.routes.js
    message.routes.js
```

## Environment Variables (server)
- `MONGO_URI`: MongoDB connection string (required)
- `JWT_SECRET`: Secret for signing JWTs (required for login)
- `CLIENT_ORIGIN`: CORS allowed origin for HTTP (defaults to `http://localhost:5173`)
- `PORT`: Server port (default `5000`)

Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/chatapp3
JWT_SECRET=supersecret
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

## Backend

### Entry & Server Setup – `server/index.js`
- Loads env (`dotenv/config`), creates Express app, attaches JSON parsing and CORS.
- Mounts routers:
  - `/api` → auth routes (signup, login)
  - `/api/messages` → message routes (history)
- Creates HTTP server and Socket.IO instance with CORS for `http://localhost:5173`.
- Connects to MongoDB via `connectDB()` and starts listening.

### Database – `server/config/db.js`
- Connects to MongoDB using `MONGO_URI`. Logs on success.

### Models
- `User` – `server/models/User.js`
  - Fields: `name`, `email` (unique), `password`
  - `pre('save')` hook hashes the password using bcrypt if modified.
- `Message` – `server/models/Message.js`
  - Fields: `userId` (ref `User`), `username`, `text`
  - `timestamps: true` adds `createdAt` (used in UI)

### Routes
- Auth – `server/routes/auth.routes.js`
  - `POST /api/signup` → `signup`
    - Body: `{ name, email, password }`
    - Creates user; returns `{ message: 'User created' }` or error.
  - `POST /api/login` → `login`
    - Body: `{ email, password }`
    - Validates password with bcrypt; signs JWT with `JWT_SECRET` (expires in 1d)
    - Returns `{ token, user: { id, name, email } }`
- Messages – `server/routes/message.routes.js`
  - `GET /api/messages`
    - Returns up to 50 messages sorted ascending by `createdAt`

Note: No JWT verification middleware on message routes; history is publicly accessible.

### Socket.IO Events
- Connection: logs `socket.id`
- `send_message` (client → server)
  - Payload: `{ userId, username, text }`
  - Validates presence of `userId` and `text`
  - Persists message via `Message.create` and emits `receive_message` to all
- `receive_message` (server → clients)
  - Broadcasts the saved message object
- `typing` (client → server)
  - Payload: `username`
  - Emits `user_typing` to other clients
- Disconnect: logs user disconnect

## Frontend

### App & Routing – `client/src/App.jsx`
- Initializes `user` from `localStorage` using `getStoredUser()`.
- Routes:
  - `/login`, `/signup` → public; redirect to `/dashboard` if logged in
  - `/dashboard`, `/chat` → protected; redirect to `/login` if not logged in
  - `*` → redirects to `/chat` (if logged in) or `/login`

### Pages
- `Login.jsx`
  - Form posts to `POST /api/login` via `loginUser`; stores `token` + `user`; navigates to `/dashboard`.
- `Signup.jsx`
  - Form posts to `POST /api/signup` via `signupUser`; navigates to `/login` upon success.
- `Dashboard.jsx`
  - Simple welcome page with buttons to go to chat and logout.
- `Chat.jsx`
  - On mount:
    - Fetches history from `GET /api/messages` (axios)
    - Subscribes to `receive_message` and `user_typing`
  - `handleSendMessage(text)` emits `send_message` with `{ userId, username, text }`
  - Tracks `typingUser` with timeout for UI indication.

### Components
- `ChatHeader.jsx`
  - Displays room title, connection indicator, current user, logout button.
- `MessageList.jsx`
  - Renders messages, grouping by sender; autoscrolls; shows typing indicator.
- `MessageInput.jsx`
  - Controlled input; submit sends message via parent callback; emits `typing` to server.

### Services
- `auth.js`
  - `loginUser(email, password)`: POST `/api/login`, stores `{ token, user }` in `localStorage`, returns `user`.
  - `signupUser(name, email, password)`: POST `/api/signup`, returns response.
  - `getStoredUser()`: reads `user` from `localStorage`.
  - `logout()`: clears `token` and `user` from `localStorage`.
- `socket.js`
  - Creates Socket.IO client for `http://localhost:5000` with `withCredentials` and `autoConnect`.

### Styling & Build
- Vite config uses React plugin and Tailwind CSS Vite plugin.
- Tailwind CSS classes used throughout components; ensure Tailwind is configured (index.css should include Tailwind directives).

## Data & Auth Flow
1. Signup → `POST /api/signup` creates user (password hashed).
2. Login → `POST /api/login` returns JWT + user; client stores in `localStorage`.
3. Navigation → `App.jsx` reads stored user to guard routes client-side.
4. Chat history → `GET /api/messages` (no auth required).
5. Realtime:
   - Send → client emits `send_message`; server saves and emits `receive_message`.
   - Typing → client emits `typing`; server broadcasts `user_typing`.

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB running and accessible via `MONGO_URI`

### Install Dependencies
```bash
# From repo root
cd server && npm install
cd ../client && npm install
```

### Configure Env
- Create `server/.env` with `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `PORT`.

### Start Backend
```bash
cd server
npm run dev
# Server on http://localhost:5000
```

### Start Frontend
```bash
cd client
npm run dev
# Vite dev server on http://localhost:5173
```

### Try It
- Open `http://localhost:5173`
- Signup, then login
- Open two browser windows to see real-time messages and typing indicators

## API Reference

### Signup
- `POST /api/signup`
- Body:
```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret" }
```
- Success:
```json
{ "message": "User created" }
```

### Login
- `POST /api/login`
- Body:
```json
{ "email": "alice@example.com", "password": "secret" }
```
- Success:
```json
{ "token": "<jwt>", "user": { "id": "<userId>", "name": "Alice", "email": "alice@example.com" } }
```

### Get Messages
- `GET /api/messages`
- Success: Array of message objects
```json
[
  {
    "_id": "...",
    "userId": "...",
    "username": "Alice",
    "text": "Hello",
    "createdAt": "2025-12-21T12:00:00.000Z",
    "updatedAt": "2025-12-21T12:00:00.000Z"
  }
]
```

## Notes & Future Improvements
- Add JWT auth middleware to protect `/api/messages` and socket connections (e.g., verify token on connect).
- Persist sessions more securely (avoid storing JWT in `localStorage` if possible).
- Add validation on signup/login, rate limiting, and error details.
- Implement pagination or infinite scroll for history.
- Add user presence, rooms, typing debounce on the client.
- Use environment variables for API base URLs on the client.
