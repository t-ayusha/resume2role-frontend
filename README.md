# Resume2Role AI — Mock Interview Platform

AI-powered interview preparation platform with real-time speech recognition, role-specific questions, and detailed performance reports.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Express 5 (Node.js), in-memory storage (MongoDB-ready via Mongoose)
- **Auth**: Email/password + Google OAuth
- **Media**: WebRTC (camera/mic), Web Speech API (TTS + STT)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env .env.local
# Edit .env.local with your values

# 3. Run frontend + backend together
npm run dev:full

# Or separately:
npm run dev        # Vite frontend on :5173
npm run dev:api    # Express API on :4000
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | API server port (default: 4000) |
| `VITE_API_URL` | Frontend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_ADMIN_CODES` | JSON map of admin codes → names |
| `JWT_SECRET` | JWT signing secret (for future JWT integration) |
| `MONGO_URI` | MongoDB connection (for future DB integration) |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ErrorBoundary.tsx   ← NEW: catches runtime errors
│   ├── LoadingSpinner.tsx  ← NEW: consistent loading state
│   └── ...
├── context/          # Auth state management
├── data/             # Mock data (questions, interview meta)
├── hooks/            # Custom hooks
├── layout/           # Page layout wrappers
├── lib/              # API client, speech utils, WebRTC
├── pages/            # Route-level page components
│   ├── NotFoundPage.tsx    ← NEW: 404 page
│   └── ...
├── server/           # Express backend
│   ├── index.ts      # Main server + routes
│   ├── models/       # Mongoose models (MongoDB-ready)
│   └── routes/       # Route handlers
└── types/            # TypeScript type declarations
```

## Features

- 🎯 **Role-specific interviews** — Frontend, Backend, PM, Data Science, UX
- 📄 **Resume-aware mode** — Upload resume for tailored questions
- 🎙 **Live speech recognition** — Real-time transcript via Web Speech API
- 🔊 **AI voice** — Question text-to-speech with natural pacing
- 📊 **Detailed reports** — Score breakdown across 4 dimensions
- 👑 **Admin dashboard** — Leaderboard and candidate analytics
- 📚 **Preparation hub** — Videos, notes, and question bank

## Known Limitations / TODO

- [ ] Persist data to MongoDB (models are ready, just wire up routes)
- [ ] Replace in-memory token with proper JWT (secret is in .env)
- [ ] Implement real AI WebRTC backend (stubs exist in `/api/webrtc/*`)
- [ ] Add bcrypt password hashing before production
- [ ] Add rate limiting to auth routes
- [ ] Implement "Replay Answers" feature on ReportPage

## Bug Fixes Applied

1. **`InterviewLivePage`** — Removed duplicate `transcriptRef` / `transcript` declarations
2. **`ProtectedRoute`** — Fixed redirect from `/auth` (missing route) to `/login`
3. **`AuthContext`** — Removed redundant `useEffect` that duplicated state initializer work
4. **`AuthContext`** — Admin codes now env-configurable via `VITE_ADMIN_CODES`
5. **`InterviewSetupPage`** — Added `isAdmin` and `navigate` to `useEffect` dependency array
6. **`LandingPage`** — Fixed `navigate('/auth')` → `navigate('/login')`
7. **`TemplatesPage`** — Removed unused `handleTemplateSelect` variable, removed duplicate inline navigations
8. **`ReportPage`** — Replaced `(report as any)?.accuracy` with typed `EnhancedReport` interface
9. **`InterviewLivePage`** — Stabilised `onTranscript` callback with `useCallback` to prevent infinite re-renders
10. **`server/index.ts`** — Fixed `topScore` bug (was showing global max for all users, now per-user)
11. **`server/index.ts`** — Added global error handler middleware
12. **`package.json`** — Removed Windows-only `.cmd` script suffixes
13. **`App.tsx`** — Added `ErrorBoundary`, `NotFoundPage`, and `/auth` → `/login` redirect alias
