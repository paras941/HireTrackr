# HireTrackr

AI-assisted job application tracker built to help candidates run a focused, data-driven job search.

## Why This Project Stands Out

Most job trackers only store applications. HireTrackr goes further by combining:
- Resume intelligence (PDF parsing and keyword extraction)
- ATS-style match scoring against job descriptions
- Skill-gap visibility with actionable suggestions
- Kanban workflow for pipeline management
- Insight dashboards and follow-up reminders

This project demonstrates end-to-end product thinking: user authentication, file handling, analytics, dashboard UX, and production-ready API structure.

## Recruiter Snapshot

- **Role fit:** Full-stack MERN-style product engineering
- **Scope:** Authentication, CRUD workflows, file upload/parsing, analytics, and recommendations
- **Architecture:** Separated client/server apps with clean controller-route-model layering
- **Business value:** Helps users prioritize better-fit roles and improve application quality

## Core Features

1. **Secure User Authentication**
   - JWT-based registration/login
   - Protected routes and authenticated profile access

2. **Resume Upload and Parsing**
   - PDF ingestion via Multer
   - Text extraction using pdf-parse
   - Skill/experience keyword indexing for downstream analysis

3. **ATS Match Analysis**
   - Job description keyword extraction
   - Match score calculation
   - Missing keyword and optimization guidance

4. **Smart Role Recommendations**
   - Skill-to-role mapping
   - Ranked role suggestions based on profile relevance

5. **Application Pipeline Tracker**
   - Full CRUD for job applications
   - Drag-and-drop Kanban board (`Applied`, `Interview`, `Rejected`)
   - Notes, company context, and role details

6. **Insights and Analytics**
   - Total applications, interview rate, rejection rate
   - Status distribution visualizations
   - Most common missing-skill trends

7. **Follow-up Intelligence**
   - Reminder logic for stale applications
   - Insight endpoints for search strategy improvements

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Axios
- Recharts
- hello-pangea/dnd
- Framer Motion

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer (file uploads)
- pdf-parse (resume parsing)
- Express Validator

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

### 1. Install dependencies

```bash
cd client
npm install
cd ../server
npm install
```

### 2. Configure environment variables

Create the following files:
- `server/.env` (based on `server/.env.example`)
- `client/.env` (based on `client/.env.example`)

Minimum backend variables:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`

Frontend variable:
- `VITE_API_URL`

### 3. Run the app

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

Open http://localhost:5173

## Key API Endpoints

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

**Resume**
- `GET /api/resume`
- `POST /api/resume/upload`
- `POST /api/resume/analyze`

**Applications**
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/applications/reminders/list?days=7`

**Insights**
- `GET /api/insights/recommendations`
- `GET /api/insights/analytics`

## Deployment

### Frontend (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Env: `VITE_API_URL=https://<render-backend-url>/api`

### Backend (Render)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Required env: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`

### Database (MongoDB Atlas)
- Create a cluster/database (example: `hiretrackr`)
- Use Atlas URI in `MONGO_URI`

## What I Would Build Next

- Cloud storage integration (S3/Cloudinary) for durable resume files
- Semantic matching using embeddings for deeper JD analysis
- Automated reminder delivery (email/WhatsApp)
- External job API integration for live opportunity discovery
- Advanced trend analysis by role, location, and company stage

## Resume-Friendly Project Summary

Designed and built a full-stack job search platform that combines application tracking, resume intelligence, and ATS-style scoring. Implemented secure JWT auth, drag-and-drop Kanban workflow, PDF parsing pipeline, and analytics dashboards to help users improve interview conversion through data-backed decisions.
