# Proactive Life Management

A personal productivity and life-management web application that pairs a React + Vite frontend with a Node.js + Prisma backend and an AI layer supporting multiple LLM providers (OpenAI, Gemini, Mistral, Claude, Groq). The app provides planning, recommendations, authentication (email/Google), and seedable sample data for quick local setup.

> Full-stack app intended for developers and early testers who want a self-hostable, AI-enhanced personal planner.

Table of contents
- Features
- Tech stack
- Architecture
- Quick start (local development)
- Environment variables
- Database (Prisma)
- AI providers
- Running tests
- Deployment
- Contributing
- Questions for maintainers

## Features
- React + Vite single-page frontend
- Node.js backend (Express-style) with structured controllers/services/repositories
- Prisma ORM with migrations and seed scripts (example travel package seed included)
- Multiple AI provider adapters: OpenAI, Gemini, Mistral, Claude, Groq
- Authentication: email/password + JWTs and Google OAuth hooks
- Email-support for verification / password reset (SMTP or console in dev)
- Rate-limiting, helmet security headers, and structured logging with pino

## Tech stack
- Language: JavaScript (ES modules)
- Frontend: React + Vite
- Backend: Node.js (ES modules) + Express-compatible handlers
- Database: PostgreSQL (works with Supabase connection string)
- ORM: Prisma
- Notable libs: @prisma/client, express, dotenv, pino, axios (frontend), react-router-dom, zustand

## Architecture
Top-level layout (high-level):

```
frontend/     React + Vite (src/, pages/, components/)
backend/      Node API (src/) with ai/ (provider adapters), controllers, routes, services, repositories
  prisma/     Prisma schema, migrations, and seed scripts
```

Runtime shape:
- Frontend calls backend REST endpoints under /api (dev proxy configured in frontend/vite.config.js).
- Backend routes → controllers → services → repositories. Repositories persist via Prisma to PostgreSQL.
- The backend aiService orchestrates requests to AI providers using provider adapters in backend/src/ai/providers.

## Quick start (local development)
Prerequisites
- Node.js 18+ (or current LTS)
- PostgreSQL (local or hosted). You can use a Supabase database and paste its connection string into BACKEND .env.
- (Optional) API keys for AI providers you want to test (OpenAI, Anthropic, Gemini, etc.)

Clone and install
```bash
git clone https://github.com/HeadExchange02/Proactive_Life_Management.git
cd Proactive_Life_Management
# Install root + workspace packages
npm run install:all
```

Configure env files
- Copy backend/.env.example → backend/.env and set DATABASE_URL and any secrets (JWT, SMTP, Google OAuth, AI keys).
- Copy frontend/.env.example → frontend/.env and set VITE_GOOGLE_CLIENT_ID and VITE_API_URL if deploying.

Database (Prisma)
```bash
# from repo root
# run migrations and generate Prisma client
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate   # runs `prisma migrate dev` (creates local dev migration)
# seed the DB (Prisma seed configured in backend/package.json)
cd backend
npx prisma db seed
cd ..
```

Start in development
```bash
# from repo root: runs frontend and backend concurrently
npm run dev
# or start backend and frontend separately
npm --prefix backend run dev   # backend: node --watch src/server.js
npm --prefix frontend run dev  # frontend: vite
```

The frontend dev server (Vite) proxies /api to the backend during development — see frontend/vite.config.js.

## Environment variables (high level)
See backend/.env.example and frontend/.env.example for full examples. Key ones:

Backend (backend/.env)
- NODE_ENV=development
- PORT=4000
- CLIENT_URL=http://localhost:5173
- DATABASE_URL="postgresql://user:password@localhost:5432/pce_dev"
- JWT_ACCESS_SECRET, JWT_REFRESH_SECRET (required; generate strong random secrets of at least 32 characters in production)
- REQUIRE_EMAIL_VERIFICATION (defaults to true in production and false otherwise; when true, SMTP must be configured so users receive verification links)
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (for Google OAuth)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (SMTP for emails; leave blank to log emails in dev)
- AI_PROVIDER (openai | claude | gemini | mistral | groq)
- OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY (keys for chosen providers)

Frontend (frontend/.env)
- VITE_API_URL=http://localhost:4000/api  # set to deployed backend URL in production
- VITE_GOOGLE_CLIENT_ID=

## AI Provider configuration
- The backend supports multiple provider adapters in backend/src/ai/providers/. Configure which provider to use by setting AI_PROVIDER in backend/.env (e.g., AI_PROVIDER=openai).
- Only the key for the selected provider is required; the repo contains adapters for OpenAI, Anthropic/Claude, Google Gemini, Mistral, and Groq.

## Running tests
Backend unit tests use the built-in Node test runner:
```bash
npm --prefix backend test
```
Coverage is currently limited to environment validation. See TESTING.md for notes on extending it.

## Deployment
See DEPLOYMENT.md in the repo root for platform-specific deployment guidance. Common steps:
- Build and serve the frontend using Vite build output (or host as static site)
- Run the backend on a hosted Node environment, set env vars, run Prisma migrations, and restore seed data as needed
- Ensure AI provider keys and SMTP credentials are set in production secrets

## Development notes
- Logging: backend uses pino + pino-http. In development pino-pretty can be used for pretty output.
- Emails: when SMTP_* vars are blank in development, emails are logged to the console.
- Security: helmet and express-rate-limit are applied; ensure secrets are long and safe in production.

## Contributing
Contributions are welcome. Typical flow:
1. Fork the repo
2. Create a feature branch
3. Run the app and add tests where appropriate
4. Open a PR describing the change

## Questions for the maintainers
I created this initial README from code and example env files. To finish and tailor a "perfect" README, please answer these:
1. What is the short project tagline (1 sentence) and public-facing description you want at the top?
2. Which license should be added (MIT, Apache-2.0, GPL, or a custom license)?
3. Who should be credited as the author / maintainer (name and email or contact link)?
4. Which AI provider should we recommend as the default in README examples (openai is in .env.example)?
5. Do you want a screenshot, app logo, or demo link included in the README? If yes, please provide images or a URL.
6. Would you like CI (GitHub Actions) or Docker instructions added to the README? If so, provide any constraints (registry, base images).

---
