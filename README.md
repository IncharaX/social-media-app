# Unlox Social Media App

A full-stack social media application built for the Unlox Week 07 Minor Project.

The app lets users create an account, log in, manage their profile, create text posts, edit or delete their own posts, and like posts from other users. The project is built with a React frontend, an Express backend, MongoDB for storage, and JWT-based authentication.

## Features

- User registration and login
- JWT authentication
- Protected profile route
- Password hashing with bcrypt
- Session restore after page refresh
- User profile view and edit
- Text post creation
- Feed with author details and timestamps
- Edit own posts
- Delete own posts
- Like and unlike posts
- Loading, empty, success, and error states
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

Frontend:

- React
- React Router
- Axios
- Vite
- CSS
- Lucide React icons

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
client/
  src/
    components/
    pages/
    services/
    styles/
    App.jsx
    main.jsx

server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
    server.js
```

## Installation

Install dependencies from the project root:

```bash
npm install
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Start MongoDB locally before running the backend.

Run the backend:

```bash
npm run dev:server
```

Run the frontend in a second terminal:

```bash
npm run dev:client
```

Frontend URL:

```text
http://localhost:5173
```

Backend URL:

```text
http://localhost:5001
```

## Environment Variables

Backend `.env`:

```text
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/unlox_social
JWT_SECRET=replace_this_with_a_long_secret
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```text
VITE_API_BASE_URL=http://localhost:5001/api
```

## API Documentation

### Health

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Register body:

```json
{
  "name": "Incharank",
  "email": "student@example.com",
  "password": "secret123"
}
```

Login body:

```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

### User Profile

```text
GET   /api/users/me
PATCH /api/users/me
```

Update profile body:

```json
{
  "name": "Incharank",
  "bio": "Full-stack student building a social app.",
  "location": "India",
  "avatarUrl": ""
}
```

### Posts

```text
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PATCH  /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
DELETE /api/posts/:id/like
```

Create or update post body:

```json
{
  "description": "Today I connected the feed to the backend."
}
```

## Protected Routes

Protected API routes require a Bearer token:

```text
Authorization: Bearer <jwt-token>
```

The frontend stores the JWT in localStorage and attaches it to API requests through an Axios interceptor.

## Build Check

Create a production frontend build:

```bash
npm run build
```

## Submission Notes

- Upload the full project folder to GitHub.
- Do not upload `node_modules`.
- Keep `.env` private.
- Include `.env.example` files so the evaluator knows which variables are required.
- Make sure MongoDB is running before testing authentication, profiles, posts, or likes.
