# HireTrackr - Smart Job Tracker + Resume Optimizer

HireTrackr is a full-stack MERN application designed to improve job search outcomes with practical, data-driven features:
- Resume upload and parsing
- ATS match scoring against job descriptions
- Smart role recommendations from profile skills
- Kanban job application workflow
- Analytics + smart insights + follow-up reminders

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Recharts, hello-pangea/dnd
- **Backend:** Node.js, Express, JWT auth, Multer, pdf-parse, Mongoose
- **Database:** MongoDB Atlas (or local MongoDB)

## Core Features Implemented

1. **Authentication**
   - JWT-based register/login
   - Protected routes and profile endpoint

2. **Resume Upload + Parsing**
   - PDF upload via Multer (memory storage)
   - Text extraction with pdf-parse
   - Basic section extraction (skills/experience) + keyword indexing

3. **Job Description Analysis + ATS**
   - JD keyword extraction
   - Match percentage calculation
   - Missing keywords and optimization suggestions

4. **Smart Job Recommendations**
   - Skill-role mapping with computed match scores
   - Ranked recommendations

5. **Job Application Tracker**
   - CRUD for applications with status (`Applied`, `Interview`, `Rejected`)
   - Kanban board with drag-and-drop status updates
   - Notes and company/role details

6. **Analytics Dashboard**
   - Total applications, interview rate, rejection rate
   - Status distribution chart
   - Most common missing skills chart

7. **Smart Insights + Follow-ups**
   - Role-based interview trend insight
   - Top missing skill insight
   - Follow-up reminders after configurable inactivity period

## Project Structure

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
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Local Setup

### 1) Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2) Environment variables

Create:
- `server/.env` from `server/.env.example`
- `client/.env` from `client/.env.example`

### 3) Run development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET /api/resume`
- `POST /api/resume/upload`
- `POST /api/resume/analyze`
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/applications/reminders/list?days=7`
- `GET /api/insights/recommendations`
- `GET /api/insights/analytics`

## Deployment

### Frontend (Vercel)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Env: `VITE_API_URL=https://<render-backend-url>/api`

### Backend (Render)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Env:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL=https://<vercel-frontend-url>`

### Database (MongoDB Atlas)
- Create a cluster and database named `hiretrackr`
- Use Atlas connection string in `MONGO_URI`

## Production Improvements You Can Add Next

- Cloudinary/S3 for persistent resume file storage
- Better NLP with embeddings for semantic JD matching
- Email/WhatsApp follow-up reminders with background jobs
- External job API integration for live job listings
- More granular role/industry insight models
