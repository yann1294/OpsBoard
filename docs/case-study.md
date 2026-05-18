# OpsBoard Case Study

## Problem

Engineering status was fragmented across CI tools, sprint boards, and chat updates. This created slow status reporting, unclear release readiness, and high manual overhead for sprint summaries.

## Solution

I built OpsBoard, a full-stack MVP that combines:

- real-time pipeline visibility (Socket.IO)
- authenticated access (Clerk)
- AI-generated sprint summaries (Gemini via backend)

The goal was to make delivery health visible in one screen and reduce time spent writing manual updates.

## Architecture

- **Frontend:** Next.js App Router dashboard on Render
- **Backend:** NestJS API + Socket.IO gateway on Render
- **Auth:** Clerk for session/token validation
- **AI:** Gemini API called server-side only
- **Data model:** in-memory mock pipeline and sprint data for rapid MVP iteration

## Key Engineering Decisions

- **Monorepo with pnpm workspaces** for shared workflows and faster iteration.
- **Server-side AI integration** to protect API keys and keep prompting logic centralized.
- **Socket.IO snapshot + incremental updates** pattern for predictable real-time UI state.
- **Guard only sensitive endpoint (`/sprint/summary`)** to keep MVP integration simple while enforcing auth where it matters.
- **Docker-first local setup** to keep onboarding and environment parity straightforward.

## Technical Challenges

- **Realtime state consistency:** handled by emitting `pipeline:snapshot` on connect and `pipeline:update` every interval.
- **Clerk token flow across frontend/backend:** enforced Bearer token extraction + verification guard in NestJS.
- **Environment wiring across services:** coordinated CORS, API base URLs, socket URLs, and Render env settings.
- **MVP scope control:** intentionally avoided database/auth over-engineering while keeping strict TypeScript and clean module boundaries.

## Results

- Delivered a portfolio-ready DevOps dashboard with live data flow and authenticated AI workflow.
- Reduced summary generation to a single click with structured executive output.
- Produced a deployment-ready setup for two Render services with Docker and documented runbooks.

## Future Improvements

- Replace mock data with real CI/CD integrations (GitHub Actions, GitLab CI).
- Add persistence and historical analytics (pipeline trends, DORA-style metrics).
- Add role-based access and organization-level permissions.
- Add automated tests for gateway events, auth guard, and AI service behavior.
- Add observability (structured logs, request tracing, error dashboards).

## Resume Bullets

- Built a full-stack DevOps dashboard (Next.js + NestJS) with real-time Socket.IO pipeline updates and Clerk-secured APIs.
- Implemented backend-only Gemini integration to generate concise sprint summaries from structured sprint context.
- Designed Dockerized local development and Render deployment for split frontend/backend services.
- Applied strict TypeScript and modular feature architecture (auth, pipelines, sprint, AI) for maintainable MVP delivery.
