# HireTrackr

HireTrackr is a full-stack job application tracker that combines pipeline management with resume analysis and interview-focused insights.

## Highlights

- JWT authentication with protected routes
- Resume upload (PDF) and keyword extraction
- ATS-style job description analysis and match scoring
- Drag-and-drop Kanban board for application stages
- Role recommendations based on extracted resume skills
- Analytics for interview rate, rejection rate, and missing skills
- Follow-up reminder endpoint for stale applications

## Tech Stack

Frontend
- React 19
- Vite 8
- React Router
- Axios
- Recharts
- @hello-pangea/dnd
- Framer Motion

Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT + bcryptjs
- Multer + pdf-parse
- express-validator

## Repository Structure

```txt
job-tracker/
  client/
    src/
      api/
      components/
      context/
      pages/
  server/
    src/
      app.js
      server.js
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)

## Local Development Setup

### 1. Install dependencies

```bash
cd client
npm install
cd ../server
npm install
```

### 2. Configure environment variables

Client

Create client/.env (or copy from client/.env.example):

```bash
VITE_API_URL=http://localhost:5000/api
```

Server

Create server/.env with:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Start both apps

Terminal 1 (backend):

```bash
cd server
npm run dev
```

Terminal 2 (frontend):

```bash
cd client
npm run dev
```

Frontend: http://localhost:5173

Backend health check: http://localhost:5000/api/health

## Available Scripts

Client (inside client)
- npm run dev
- npm run build
- npm run preview
- npm run lint

Server (inside server)
- npm run dev
- npm start

## API Routes

Base URL: /api

Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me
- PUT /auth/profile

Resume
- GET /resume
- POST /resume/upload
- POST /resume/analyze

Applications
- GET /applications
- POST /applications
- PUT /applications/:id
- DELETE /applications/:id
- GET /applications/reminders/list?days=7

Insights
- GET /insights/recommendations
- GET /insights/analytics

All routes except register/login require a Bearer token.

## Deployment Notes

Frontend (Vercel)
- Root directory: client
- Build command: npm run build
- Output directory: dist
- Environment variable: VITE_API_URL=https://your-backend-url/api

Backend (Render)
- Root directory: server
- Build command: npm install
- Start command: npm start
- Environment variables: PORT, MONGO_URI, JWT_SECRET, CLIENT_URL

MongoDB
- Use MongoDB Atlas or a self-hosted MongoDB instance
- Set connection string in MONGO_URI

## Future Improvements

- Persist resume files in cloud storage (S3/Cloudinary)
- Add semantic matching with embeddings
- Add automated follow-up notifications (email/WhatsApp)
- Add richer trends by role, location, and company
