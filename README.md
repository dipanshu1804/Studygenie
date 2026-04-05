# StudyGenie – AI Based Student Doubt Solving System

StudyGenie is a full-stack web application that helps students get instant, step-by-step explanations for academic doubts across 9 subjects. Students type a question, select a subject, and receive a structured AI-generated answer powered by OpenAI's GPT-4o-mini. Registered users can bookmark responses, rate answers, and review their full question history through a personal dashboard.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, TypeScript, Vite          |
| Styling    | Tailwind CSS                        |
| Routing    | React Router v6                     |
| HTTP       | Axios                               |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (Mongoose ODM)        |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| AI         | OpenAI API (GPT-4o-mini)            |

---

## Features

1. **AI-Powered Answers** — GPT-4o-mini returns markdown-formatted, step-by-step explanations
2. **9 Subject Support** — Mathematics, Programming, Science, Physics, Chemistry, Biology, History, English, General
3. **Guest Mode** — Ask questions without an account (responses not saved)
4. **User Authentication** — JWT-based register/login with bcrypt password hashing
5. **Question History** — Logged-in users can view their last 50 questions on the dashboard
6. **Bookmarks** — Save and filter important responses with a star toggle
7. **Star Ratings** — Rate each AI response from 1–5 stars
8. **Responsive UI** — Dark-themed interface with mobile hamburger navigation

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free tier works)
- An OpenAI API key

### Steps

**1. Clone the repository**
```bash
git clone <repo-url>
cd studygenie
```

**2. Set up the backend**
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_secret_key
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
```

**3. Start the backend**
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

**4. Set up the frontend**
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

**5. Open in browser**

Visit `http://localhost:5173` — the app is ready to use.

---

## API Endpoints

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | `/api/auth/register`      | None     | Create a new account     |
| POST   | `/api/auth/login`         | None     | Login and receive JWT    |
| GET    | `/api/auth/me`            | Required | Get current user info    |
| POST   | `/api/query/ask`          | Optional | Ask an AI question       |
| GET    | `/api/query/history`      | Required | Fetch user's history     |
| DELETE | `/api/query/:id`          | Required | Delete a query           |
| PATCH  | `/api/query/:id/bookmark` | Required | Toggle bookmark          |
| PATCH  | `/api/query/:id/rate`     | Required | Rate a response (1–5)    |

---

## Project Structure

```
studygenie/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Register, login, get user
│   │   └── queryController.js     # Ask, history, delete, bookmark, rate
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect & optionalAuth
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt hashing
│   │   └── Query.js               # Query schema with rating & bookmark
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── queryRoutes.js
│   ├── .env                       # Not committed (see .gitignore)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthModal.tsx       # Login / Register modal
    │   │   ├── Navbar.tsx          # Top nav with mobile hamburger
    │   │   └── ResponseCard.tsx    # AI answer card with rating & bookmark
    │   ├── context/
    │   │   └── AuthContext.tsx     # Global auth state & JWT handling
    │   ├── pages/
    │   │   ├── HomePage.tsx        # Main question interface
    │   │   ├── DashboardPage.tsx   # User history & filters
    │   │   ├── NotFoundPage.tsx    # 404 page
    │   │   └── LoadingPage.tsx     # Auth restore splash screen
    │   ├── utils/
    │   │   ├── api.ts              # Axios instance with JWT interceptor
    │   │   └── subjects.ts         # Subject definitions with emoji
    │   └── App.tsx                 # Routes + JWT expiry check
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Project Information

| Field        | Details                                      |
|--------------|----------------------------------------------|
| Student      | Dipanshu                                     |
| Student ID   | 2211981145                                   |
| Guide        | Dr. Nagesh Kumar                             |
| University   | Chitkara University, Himachal Pradesh        |
| Project Type | Final Semester Project                       |
