# Proactive Life Management

A personal life-management web application for Bangladesh. It pairs a React + Vite frontend with a Node.js + Prisma backend and an AI layer that supports multiple LLM providers (OpenAI, Gemini, Mistral, Claude, Groq). Users get AI-guided help with travel, healthcare, agriculture, budgeting, goals, habits and more, with email or Google sign-in.

> Full-stack app intended for developers and early testers who want a self-hostable, AI-enhanced personal planner.

Table of contents
- Features
- Tech stack
- Architecture
- Quick start (local development)
- Environment variables
- Google Sign-In setup
- Database (Prisma)
- AI providers
- Frontend UI notes
- Running tests
- Deployment
- Contributing
- Questions for maintainers

## Features
- **AI Assistant hub** — chat, career roadmap, resume, interview practice, skill-gap analysis, learning plan and assistant memory
- **Travel, Healthcare and Agriculture** modules with AI recommendations (travel package and agriculture seed data included)
- **Bangladesh Service Hub** — finance/budget, government services, utility bills and emergency contacts
- **Planning tools** — goals, habits, planner, reports and notifications
- **Authentication** — email/password with JWT (access + refresh cookie), email verification, password reset, and **Sign in with Google**
- **Admin panel** for administrators
- Light/dark theme, plus subtle animations and hover effects (respects the OS "reduce motion" setting)
- Rate limiting, Helmet security headers and structured logging with pino

## Tech stack
- Language: JavaScript (JSX on the frontend), small TypeScript usage in the Prisma seed
- Frontend: React 19, Vite, Tailwind CSS v4, HeroUI styles, react-router-dom, react-hook-form, zustand, axios, lucide-react
- Backend: Node.js (ES modules) + Express
- Database: PostgreSQL (works with a Supabase connection string)
- ORM: Prisma
- Auth: JWT + `google-auth-library` for Google ID-token verification

## Architecture
Top-level layout:

```
frontend/     React + Vite
  src/
    pages/        public/ (landing, auth) and dashboard/ (modules, assistant/, bd-hub/)
    components/   landing/, layout/, dashboard/, common/ (Reveal, CountUp, GoogleSignInButton)
    contexts/     Auth, Theme, AI provider
    hooks/        useInView, useScrolled, useAIRecommendation
    services/     axios API clients
backend/      Node API
  src/            routes → controllers → services → repositories, ai/ (provider adapters)
  prisma/         schema, migrations and seed scripts
```

Runtime shape:
- The frontend calls backend REST endpoints under `/api` (`baseURL: '/api'` in `frontend/src/services/api.js`; the dev proxy in `frontend/vite.config.js` forwards it to `http://localhost:4000`).
- Backend routes → controllers → services → repositories. Repositories persist via Prisma to PostgreSQL.
- `aiService` orchestrates requests to AI providers through the adapters in `backend/src/ai/providers`.

## Quick start (local development)
Prerequisites
- Node.js 18+ (or current LTS)
- PostgreSQL (local or hosted). You can use a Supabase database and paste its connection string into `backend/.env`.
- (Optional) API keys for the AI providers you want to test

Clone and install
```bash
git clone https://github.com/HeadExchange02/Proactive_Life_Management.git
cd Proactive_Life_Management
npm run install:all
```

Configure env files
- Copy `backend/.env.example` → `backend/.env` and set `DATABASE_URL` and secrets (JWT, SMTP, Google OAuth, AI keys).
- Copy `frontend/.env.example` → `frontend/.env` and set `VITE_GOOGLE_CLIENT_ID` to enable Google Sign-In.

Database (Prisma)
```bash
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate   # prisma migrate dev
cd backend && npx prisma db seed && cd ..
```

Start in development
```bash
# from repo root: runs backend and frontend together
npm run dev
# or separately
npm --prefix backend run dev    # node --watch src/server.js  (http://localhost:4000)
npm --prefix frontend run dev   # vite                         (http://localhost:5173)
```

## Environment variables
See `backend/.env.example` and `frontend/.env.example` for full examples.

Backend (`backend/.env`)
- `NODE_ENV`, `PORT` (default 4000), `CLIENT_URL` (default http://localhost:5173)
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (generate strong random values, e.g. `openssl rand -hex 32`), `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`
- `GOOGLE_CLIENT_ID` (required for Google Sign-In; `GOOGLE_CLIENT_SECRET` is loaded but not needed by the ID-token flow)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (leave blank in dev to log emails to the console)
- `AI_PROVIDER` (`openai` | `claude` | `gemini` | `groq` | `mistral`; defaults to `gemini` if unset)
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY` (only the key for the chosen provider is required)

Frontend (`frontend/.env`)
- `VITE_GOOGLE_CLIENT_ID` — same Google client ID as the backend. If empty, the Google button is hidden and email login still works.
- `VITE_API_URL` is listed in the example file but the current code uses the fixed `/api` base URL. For a production setup where the frontend and backend are on different domains, update `baseURL` in `frontend/src/services/api.js` (and the `/api/auth/refresh` call there) to use it.

> Never commit real secrets. Keep `.env` files out of git and rotate any key that has been committed.

## Google Sign-In setup
1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) create an **OAuth client ID** of type *Web application*.
2. Add your frontend URLs under **Authorized JavaScript origins** (for local dev: `http://localhost:5173`, plus your production domain).
3. Set the client ID in both places:
   - `backend/.env` → `GOOGLE_CLIENT_ID=...`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=...`
4. Restart both dev servers.

How it works: the frontend loads Google's official script and renders the button on the Login and Signup pages. Google returns an ID token, which is sent to `POST /api/auth/google`. The backend verifies it, requires a verified Google email, then creates the user or links the Google account to an existing user with the same email, and issues the usual JWT session.

## AI providers
- Adapters live in `backend/src/ai/providers/` (OpenAI, Claude, Gemini, Groq, Mistral, plus an extra provider adapter).
- Choose the default with `AI_PROVIDER` in `backend/.env`; only that provider's API key is required.

## Frontend UI notes
- Design tokens (colors, radii, shadows, fonts) are defined in `frontend/src/styles/index.css`; dark mode is toggled with a `dark` class on `<html>`.
- Animations are CSS-first with no extra dependency: page fade-in, entrance stagger (`animate-fade-up`), scroll reveal (`components/common/Reveal.jsx`), number count-up (`CountUp.jsx`), hover lift (`card-hover`) and floating shapes.
- All motion is disabled automatically when the user has `prefers-reduced-motion` enabled.

## Running tests
There are no automated tests configured at the moment. See `TESTING.md` for notes. For frontend checks you can run `npm --prefix frontend run lint` and `npm --prefix frontend run build`.

## Deployment
See `DEPLOYMENT.md` in the repo root for platform-specific guidance. Common steps:
- Build the frontend (`npm --prefix frontend run build`) and serve the output as a static site
- Run the backend on a hosted Node environment, set env vars, and run Prisma migrations
- Set AI provider keys, SMTP credentials and the Google client ID in production secrets, and add the production domain to the Google OAuth authorized origins

## Development notes
- Logging: the backend uses pino + pino-http.
- Emails: when `SMTP_*` is blank in development, emails are logged to the console.
- Security: Helmet and express-rate-limit are applied; keep secrets long and private in production.

## Contributing
Contributions are welcome. Typical flow:
1. Fork the repo
2. Create a feature branch
3. Run the app and add tests where appropriate
4. Open a PR describing the change

## Questions for maintainers
Still open, to finish the README:
1. A short project tagline and public-facing description?
2. Which license should be added (MIT, Apache-2.0, GPL, or custom)?
3. Who should be credited as the author / maintainer?
4. Do you want screenshots, a logo or a demo link?
5. Would you like CI (GitHub Actions) or Docker instructions added?
