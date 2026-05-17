# OpsBoard Codex Instructions

## Project Goal

Build OpsBoard, a visible MVP DevOps monitoring dashboard.

The demo must show:
1. User signs in with Clerk.
2. Dashboard loads.
3. Pipeline cards update every few seconds.
4. User clicks Generate Summary.
5. Gemini returns a clean sprint summary.
6. App runs locally with Docker.
7. App is live on Render.
8. README explains the architecture clearly.

## Stack

- Monorepo with `client/` and `server/`
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, TanStack Query
- Backend: NestJS, TypeScript
- Realtime: Socket.IO
- Auth: Clerk
- AI: Gemini API via server-side NestJS service
- DevOps: Docker, docker-compose, Render

## Rules

- Keep the MVP simple.
- Do not add a database yet.
- Use mock data for pipelines and sprint data.
- Do not expose Gemini API keys in frontend code.
- Do not over-engineer architecture.
- Prefer clean, beginner-readable TypeScript.
- After each change, explain:
  - files changed
  - how to test
  - any environment variables needed
- Use pnpm.
- Keep commits small and feature-based.

## Validation

Before saying a task is complete, check:
- TypeScript compiles
- the relevant app starts
- no obvious missing imports
- environment variables are documented
