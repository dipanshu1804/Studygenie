# StudyGenie – AI Based Student Doubt Solving System

A full-stack web application built with the **MERN stack** that provides instant, AI-powered academic doubt resolution for students.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | OpenAI API (GPT-4o-mini) |
| Auth | JWT + bcryptjs |

---

## Project Structure

```
studygenie/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, GetMe
│   │   └── queryController.js     # Ask, History, Delete, Bookmark, Rate
│   ├── middleware/
│   │   └── authMiddleware.js      # requireAuth, optionalAuth
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Query.js               # Query schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── queryRoutes.js
│   ├── .env.example               # Copy to .env and fill values
│   ├── package.json
│   └── server.js                  # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── AuthModal.tsx
    │   │   └── ResponseCard.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   └── DashboardPage.tsx
    │   ├── utils/
    │   │   ├── api.ts
    │   │   └── subjects.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Setup Instructions

### Step 1 — Prerequisites

Make sure you have installed:
- **Node.js** v18 or above → https://nodejs.org
- **Git** → https://git-scm.com

---

### Step 2 — Get Required Keys

You need two things before running the app:

**A) MongoDB Atlas (Free)**
1. Go to https://www.mongodb.com/atlas
2. Create a free account and a free cluster
3. Click **Connect** → **Drivers** → copy the connection string
4. Replace `<password>` in the string with your DB user password

**B) OpenAI API Key**
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key and copy it

---

### Step 3 — Backend Setup

```bash
# Navigate to backend
cd studygenie/backend

# Install dependencies
npm install

# Create your .env file from the example
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/studygenie?retryWrites=true&w=majority
JWT_SECRET=choose_any_long_random_string_here
OPENAI_API_KEY=sk-your-openai-api-key-here
FRONTEND_URL=http://localhost:5173
```

```bash
# Start the backend server
npm run dev
# Server will run on http://localhost:5000
```

---

### Step 4 — Frontend Setup

Open a **new terminal tab/window**:

```bash
# Navigate to frontend
cd studygenie/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# App will open at http://localhost:5173
```

---

### Step 5 — Open the App

Visit **http://localhost:5173** in your browser.

---

## Features Implemented

- **Ask a Doubt** — Submit any academic question with a subject category
- **AI Response** — GPT-4o-mini generates structured, step-by-step explanations
- **9 Subjects** — Mathematics, Programming, Science, Physics, Chemistry, Biology, History, English, General
- **User Auth** — Register/Login with JWT-secured sessions
- **Question History** — Saved automatically for logged-in users
- **Dashboard** — Browse, search, and filter past questions
- **Bookmarks** — Save important answers for later
- **Ratings** — Rate each AI response (1–5 stars)
- **Delete** — Remove individual queries from history
- **Responsive UI** — Works on mobile and desktop

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create new account |
| POST | /api/auth/login | Login and get JWT |
| GET | /api/auth/me | Get current user (auth required) |

### Queries
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/query/ask | Submit a question (auth optional) |
| GET | /api/query/history | Get user's question history (auth required) |
| DELETE | /api/query/:id | Delete a query (auth required) |
| PATCH | /api/query/:id/bookmark | Toggle bookmark (auth required) |
| PATCH | /api/query/:id/rate | Rate a response (auth required) |

---

## Deployment (Optional)

**Backend** → Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- Set all `.env` variables in the platform's environment settings
- Update `FRONTEND_URL` to your deployed frontend URL

**Frontend** → Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Set `VITE_API_URL` if not using a proxy
- Update the backend's `FRONTEND_URL` to match

---

## Submitted By

- **Name:** Dipanshu
- **University ID:** 2211981145
- **Department:** BE-CSE
- **Guide:** Dr. Nagesh Kumar
- **University:** Chitkara University, Himachal Pradesh
