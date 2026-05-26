# OpsBoard File-By-File Walkthrough

This document is a learning map for the important files in OpsBoard. It explains what each file does, why it exists, who depends on it, and what would break if it were removed.

OpsBoard has four main areas:

- Frontend: Next.js app in `client/`
- Backend: NestJS app in `server/`
- DevOps: Docker, pnpm workspace, environment files
- Documentation: README and docs files

## Frontend Files

### `client/src/app/layout.tsx`

Belongs to: frontend

What it does:

- Defines the global Next.js App Router layout.
- Wraps the app in `ClerkProvider`.
- Wraps the app in `QueryProvider`.
- Renders the shared page header.
- Shows a Clerk sign-in button for signed-out users.
- Shows Clerk `UserButton` for signed-in users.
- Loads global styles and fonts.

Why it exists:

- Every route needs the same authentication context, query context, and visual shell.
- This is the correct place for app-wide providers in a Next.js App Router app.

Other files that depend on it:

- Every page under `client/src/app/`.
- `client/src/app/page.tsx` indirectly depends on the providers defined here.
- `client/src/features/sprint-summary/sprint-summary-card.tsx` depends on Clerk context and React Query context from here.
- `client/src/features/integrations/github-actions-card.tsx` depends on React Query context from here.

What would break if removed:

- The app would lose its root HTML/body layout.
- Clerk auth context would not be available.
- TanStack Query hooks would fail without `QueryClientProvider`.
- The shared header and global CSS import would disappear.

### `client/src/app/page.tsx`

Belongs to: frontend

What it does:

- Defines the homepage route.
- Shows signed-out landing content.
- Shows the signed-in dashboard.
- Renders dashboard metric cards.
- Renders `PipelineFeed`.
- Renders `SprintSummaryCard`.
- Renders `GitHubActionsCard`.

Why it exists:

- This is the main visible MVP screen.
- It connects the feature components into one dashboard experience.

Other files that depend on it:

- Next.js routing uses it for `/`.
- The dashboard experience depends on all imported feature components.

What would break if removed:

- The root page would disappear.
- Users would not see the dashboard.
- Pipeline, AI summary, and GitHub cards would no longer be rendered.

### `client/src/app/globals.css`

Belongs to: frontend

What it does:

- Imports Tailwind CSS.
- Defines global CSS variables.
- Applies the global background, foreground, and font family.

Why it exists:

- Provides the styling foundation for the whole frontend.

Other files that depend on it:

- `client/src/app/layout.tsx` imports it.
- All rendered components depend on the global Tailwind setup.

What would break if removed:

- Tailwind styles may not load correctly.
- Global colors and font setup would be lost.
- The UI would look unstyled or inconsistent.

### `client/src/proxy.ts`

Belongs to: frontend

What it does:

- Runs Clerk middleware for frontend routes.
- Uses a matcher that excludes common static assets.

Why it exists:

- Clerk needs request-level integration with Next.js.
- This enables Clerk auth state to work correctly with the app.

Other files that depend on it:

- It is used by the Next.js runtime rather than imported manually.
- Auth-related UI in `layout.tsx` and `page.tsx` relies on Clerk being correctly configured.

What would break if removed:

- Clerk route/session behavior may become incomplete.
- Auth state handling may fail in some routes or deployments.

### `client/src/lib/query-provider.tsx`

Belongs to: frontend

What it does:

- Creates a TanStack Query `QueryClient`.
- Provides it through `QueryClientProvider`.
- Sets query defaults:
  - `staleTime: 15_000`
  - `refetchOnWindowFocus: false`

Why it exists:

- React Query hooks require a provider.
- It centralizes query behavior for the frontend.

Other files that depend on it:

- `client/src/app/layout.tsx` imports it.
- `client/src/features/sprint-summary/sprint-summary-card.tsx` uses `useMutation`.
- `client/src/features/integrations/github-actions-card.tsx` uses `useQuery`.

What would break if removed:

- Components using `useQuery` or `useMutation` would throw because no `QueryClient` is available.
- AI summary and GitHub workflow fetching would break.

### `client/src/lib/api.ts`

Belongs to: frontend

What it does:

- Defines the shared `apiFetch` helper.
- Reads `NEXT_PUBLIC_API_URL`.
- Falls back to `http://localhost:4000`.
- Adds `Content-Type: application/json`.
- Adds `Authorization: Bearer <token>` when a token is provided.
- Throws useful errors for failed HTTP responses.

Why it exists:

- Keeps backend API calls consistent.
- Avoids duplicating base URL, headers, token handling, and error handling.

Other files that depend on it:

- `client/src/features/sprint-summary/sprint-summary-card.tsx`
- `client/src/features/integrations/github-actions-card.tsx`

What would break if removed:

- AI summary requests would break.
- GitHub workflow run requests would break.
- Components would need their own duplicated fetch logic.

### `client/src/lib/socket.ts`

Belongs to: frontend

What it does:

- Creates a Socket.IO client.
- Reads `NEXT_PUBLIC_SOCKET_URL`.
- Falls back to `http://localhost:4000`.
- Uses WebSocket transport.
- Sets `autoConnect: false`.

Why it exists:

- Keeps realtime connection setup in one place.
- Lets `PipelineFeed` focus on UI state and event handling.

Other files that depend on it:

- `client/src/features/pipelines/pipeline-feed.tsx`

What would break if removed:

- `PipelineFeed` could not create a realtime connection.
- Live pipeline updates would stop working.

### `client/src/types/pipeline.ts`

Belongs to: frontend

What it does:

- Defines `PipelineStatus`.
- Defines `PipelineRun`.

Why it exists:

- Gives the frontend a clear TypeScript shape for pipeline data.

Other files that depend on it:

- `client/src/features/pipelines/pipeline-feed.tsx`

What would break if removed:

- TypeScript imports in `PipelineFeed` would fail.
- Pipeline data handling would lose type safety.

### `client/src/features/pipelines/pipeline-feed.tsx`

Belongs to: frontend

What it does:

- Connects to the backend Socket.IO server.
- Tracks live/offline status.
- Tracks connection errors.
- Receives `pipeline:snapshot`.
- Receives `pipeline:update`.
- Renders pipeline run cards.
- Keeps only the newest 8 runs in the UI.

Why it exists:

- This is the main realtime demo feature.
- It shows pipeline activity updating every few seconds.

Other files that depend on it:

- `client/src/app/page.tsx`

Files it depends on:

- `client/src/lib/socket.ts`
- `client/src/types/pipeline.ts`

What would break if removed:

- The dashboard would lose the live pipeline feed.
- Socket.IO updates from the backend would still be emitted, but the frontend would not display them.

### `client/src/features/sprint-summary/sprint-summary-card.tsx`

Belongs to: frontend

What it does:

- Renders the AI sprint summary card.
- Handles the Generate Summary button.
- Gets a Clerk token with `useAuth()`.
- Calls `GET /sprint/summary` through `apiFetch`.
- Uses TanStack Query `useMutation`.
- Displays loading, error, and success states.

Why it exists:

- This is the frontend for the authenticated Gemini summary flow.

Other files that depend on it:

- `client/src/app/page.tsx`

Files it depends on:

- `client/src/lib/api.ts`
- `client/src/lib/query-provider.tsx` through React Query context
- `client/src/app/layout.tsx` through Clerk context

What would break if removed:

- Users could not generate sprint summaries from the dashboard.
- The protected `/sprint/summary` endpoint would still exist, but no UI would call it.

### `client/src/features/integrations/github-actions-card.tsx`

Belongs to: frontend

What it does:

- Fetches recent GitHub Actions workflow runs.
- Calls `GET /integrations/github/actions`.
- Renders workflow name, branch, short commit SHA, status, updated time, and link.
- Shows loading, error, and empty states.

Why it exists:

- Adds an optional real integration to complement mock pipeline data.

Other files that depend on it:

- `client/src/app/page.tsx`

Files it depends on:

- `client/src/lib/api.ts`
- `client/src/lib/query-provider.tsx` through React Query context

What would break if removed:

- The dashboard would lose the GitHub Actions card.
- The backend GitHub endpoint could still exist, but the frontend would not display it.

### `client/.env.local.example`

Belongs to: frontend

What it does:

- Documents required frontend environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_SOCKET_URL`

Why it exists:

- Helps developers create `client/.env.local`.
- Documents which frontend variables must be public.

Other files that depend on it:

- No source files import it directly.
- Humans and setup docs depend on it.

What would break if removed:

- The app would still run if real env vars exist.
- New developers would have less guidance and may misconfigure Clerk, API URL, or socket URL.

### `client/package.json`

Belongs to: frontend

What it does:

- Defines frontend dependencies.
- Defines scripts:
  - `dev`
  - `build`
  - `start`
  - `lint`

Why it exists:

- pnpm and Docker need it to install and run the frontend.

Other files that depend on it:

- `client/Dockerfile`
- Root workspace scripts
- Local development commands

What would break if removed:

- Frontend dependencies could not be installed normally.
- Frontend Docker build would fail.
- Next.js scripts would disappear.

### `client/next.config.ts`

Belongs to: frontend

What it does:

- Defines Next.js configuration.
- Currently contains no custom options.

Why it exists:

- Standard customization point for Next.js.

Other files that depend on it:

- Next.js build/runtime reads it.
- `client/Dockerfile` copies it in the production image.

What would break if removed:

- Current app may still work with defaults.
- The production Dockerfile copy step would fail unless updated.

### `client/tsconfig.json`

Belongs to: frontend

What it does:

- Configures TypeScript for the frontend.
- Supports Next.js TypeScript behavior and path aliases.

Why it exists:

- Needed for type checking and compilation.

Other files that depend on it:

- Next.js build.
- TypeScript tooling.
- Editor IntelliSense.

What would break if removed:

- Frontend TypeScript build and editor support would likely fail.

## Backend Files

### `server/src/main.ts`

Belongs to: backend

What it does:

- Bootstraps the NestJS app.
- Creates the app from `AppModule`.
- Reads `CLIENT_URL`.
- Reads `PORT`.
- Enables CORS.
- Enables global validation with `ValidationPipe`.
- Starts the server.

Why it exists:

- This is the backend runtime entry point.

Other files that depend on it:

- The Nest runtime uses it to start the server.
- The production build outputs it into `dist/main.js`.

Files it depends on:

- `server/src/app.module.ts`

What would break if removed:

- The backend could not start.
- Docker production command `node dist/main.js` would not have a valid built entrypoint.

### `server/src/app.module.ts`

Belongs to: backend

What it does:

- Defines the root NestJS module.
- Loads global configuration with `ConfigModule.forRoot({ isGlobal: true })`.
- Imports all feature modules:
  - `AiModule`
  - `AuthModule`
  - `GitHubIntegrationModule`
  - `PipelinesModule`
  - `SprintModule`
- Registers `AppController` and `AppService`.

Why it exists:

- NestJS needs a root module that defines the application dependency graph.

Other files that depend on it:

- `server/src/main.ts`

What would break if removed:

- The backend could not bootstrap.
- Controllers, services, modules, and gateways would not be registered.

### `server/src/app.controller.ts`

Belongs to: backend

What it does:

- Defines `GET /`.
- Defines `GET /health`.

Why it exists:

- Provides a simple root response.
- Provides the health check used by deployment platforms like Render.

Other files that depend on it:

- `server/src/app.module.ts`

Files it depends on:

- `server/src/app.service.ts`

What would break if removed:

- `GET /` would disappear.
- `GET /health` would disappear.
- Render health checks could fail.

### `server/src/app.service.ts`

Belongs to: backend

What it does:

- Provides `getHello()`.
- Returns `"Hello World!"` for the root route.

Why it exists:

- Keeps root route response logic outside the controller.

Other files that depend on it:

- `server/src/app.controller.ts`

What would break if removed:

- `AppController` dependency injection would fail unless the controller were changed.

### `server/src/auth/auth.module.ts`

Belongs to: backend

What it does:

- Registers `ClerkAuthGuard`.
- Exports `ClerkAuthGuard`.

Why it exists:

- Makes the guard available to other modules.

Other files that depend on it:

- `server/src/app.module.ts`
- `server/src/sprint/sprint.module.ts`

Files it depends on:

- `server/src/auth/clerk-auth.guard.ts`

What would break if removed:

- `SprintModule` could not import auth functionality cleanly.
- Protected routes using the guard may fail dependency injection.

### `server/src/auth/clerk-auth.guard.ts`

Belongs to: backend

What it does:

- Implements NestJS `CanActivate`.
- Reads the `Authorization` header.
- Requires `Bearer <token>`.
- Reads `CLERK_SECRET_KEY`.
- Reads `CLERK_AUTHORIZED_PARTIES`, or falls back to `CLIENT_URL`.
- Calls Clerk `verifyToken`.
- Stores the verified payload on `request.user`.

Why it exists:

- Protects backend routes with Clerk authentication.

Other files that depend on it:

- `server/src/auth/auth.module.ts`
- `server/src/sprint/sprint.controller.ts`

What would break if removed:

- `/sprint/summary` could not be protected as implemented.
- Authenticated AI summary flow would fail or become insecure.

### `server/src/pipelines/pipelines.module.ts`

Belongs to: backend

What it does:

- Registers:
  - `PipelinesController`
  - `PipelinesService`
  - `PipelinesGateway`
- Exports `PipelinesService`.

Why it exists:

- Groups all pipeline-related backend functionality.

Other files that depend on it:

- `server/src/app.module.ts`

Files it depends on:

- `server/src/pipelines/pipelines.controller.ts`
- `server/src/pipelines/pipelines.service.ts`
- `server/src/pipelines/pipelines.gateway.ts`

What would break if removed:

- `GET /pipelines` would not be registered.
- Socket.IO pipeline events would not be registered.
- Realtime pipeline demo would stop working.

### `server/src/pipelines/pipelines.controller.ts`

Belongs to: backend

What it does:

- Defines `GET /pipelines`.
- Returns all current pipeline runs from `PipelinesService`.

Why it exists:

- Provides REST access to pipeline data.

Other files that depend on it:

- `server/src/pipelines/pipelines.module.ts`

Files it depends on:

- `server/src/pipelines/pipelines.service.ts`
- `server/src/pipelines/pipeline-run.type.ts`

What would break if removed:

- `GET /pipelines` would disappear.
- Socket.IO could still work if the gateway remains registered, but REST pipeline access would be gone.

### `server/src/pipelines/pipelines.service.ts`

Belongs to: backend

What it does:

- Stores current pipeline runs in memory.
- Starts with two mock runs.
- Provides `getAllRuns()`.
- Provides `createMockUpdate()`.
- Generates random service, branch, committer, status, commit SHA, duration, and timestamp.
- Keeps at most 20 runs in memory.

Why it exists:

- It is the backend source of pipeline data for the MVP.
- It keeps data-generation logic out of controllers and gateways.

Other files that depend on it:

- `server/src/pipelines/pipelines.controller.ts`
- `server/src/pipelines/pipelines.gateway.ts`
- `server/src/pipelines/pipelines.module.ts`

Files it depends on:

- `server/src/pipelines/pipeline-run.type.ts`

What would break if removed:

- `GET /pipelines` would fail.
- `pipeline:snapshot` would fail.
- `pipeline:update` generation would fail.

### `server/src/pipelines/pipelines.gateway.ts`

Belongs to: backend

What it does:

- Defines the Socket.IO gateway.
- Configures Socket.IO CORS using `CLIENT_URL`.
- Emits `pipeline:snapshot` when a client connects.
- Starts a 5-second interval on module init.
- Calls `PipelinesService.createMockUpdate()`.
- Broadcasts `pipeline:update` to connected clients.
- Clears the interval on module destroy.

Why it exists:

- Implements the live realtime pipeline demo.

Other files that depend on it:

- `server/src/pipelines/pipelines.module.ts`
- `client/src/features/pipelines/pipeline-feed.tsx` depends on its events at runtime.

Files it depends on:

- `server/src/pipelines/pipelines.service.ts`

What would break if removed:

- Socket.IO pipeline updates would stop.
- The frontend pipeline feed would stay offline or never receive events.

### `server/src/pipelines/pipeline-run.type.ts`

Belongs to: backend

What it does:

- Defines `PipelineStatus`.
- Defines `PipelineRun`.

Why it exists:

- Gives backend pipeline data a clear TypeScript contract.

Other files that depend on it:

- `server/src/pipelines/pipelines.service.ts`
- `server/src/pipelines/pipelines.controller.ts`

What would break if removed:

- TypeScript imports would fail.
- Backend pipeline files would not compile.

### `server/src/sprint/sprint.module.ts`

Belongs to: backend

What it does:

- Registers `SprintController`.
- Registers `SprintService`.
- Imports `AiModule`.
- Imports `AuthModule`.

Why it exists:

- Groups sprint-related backend functionality.
- Gives `SprintController` access to sprint data, AI, and auth dependencies.

Other files that depend on it:

- `server/src/app.module.ts`

Files it depends on:

- `server/src/sprint/sprint.controller.ts`
- `server/src/sprint/sprint.service.ts`
- `server/src/ai/ai.module.ts`
- `server/src/auth/auth.module.ts`

What would break if removed:

- `GET /sprint/mock` would disappear.
- `GET /sprint/summary` would disappear.
- AI summary feature would break.

### `server/src/sprint/sprint.controller.ts`

Belongs to: backend

What it does:

- Defines `GET /sprint/mock`.
- Defines protected `GET /sprint/summary`.
- Uses `ClerkAuthGuard` on `/sprint/summary`.
- Gets mock sprint data from `SprintService`.
- Sends sprint data to `AiService`.
- Returns `summary`, `source`, and `generatedAt`.

Why it exists:

- It is the HTTP entry point for sprint-related API requests.

Other files that depend on it:

- `server/src/sprint/sprint.module.ts`
- `client/src/features/sprint-summary/sprint-summary-card.tsx` depends on `/sprint/summary` at runtime.

Files it depends on:

- `server/src/sprint/sprint.service.ts`
- `server/src/ai/ai.service.ts`
- `server/src/auth/clerk-auth.guard.ts`

What would break if removed:

- Sprint API endpoints would disappear.
- Generate Summary button would fail.

### `server/src/sprint/sprint.service.ts`

Belongs to: backend

What it does:

- Defines `SprintMockData`.
- Returns hardcoded sprint data:
  - sprint name
  - period
  - completed items
  - in-progress items
  - blockers
  - metrics

Why it exists:

- Provides simple structured data for the MVP.
- Keeps mock data separate from controller logic.

Other files that depend on it:

- `server/src/sprint/sprint.controller.ts`

What would break if removed:

- `/sprint/mock` would fail.
- `/sprint/summary` would have no sprint data to summarize.

### `server/src/ai/ai.module.ts`

Belongs to: backend

What it does:

- Registers `AiService`.
- Exports `AiService`.

Why it exists:

- Allows other modules, especially `SprintModule`, to inject AI functionality.

Other files that depend on it:

- `server/src/app.module.ts`
- `server/src/sprint/sprint.module.ts`

Files it depends on:

- `server/src/ai/ai.service.ts`

What would break if removed:

- `SprintController` could not inject `AiService`.
- AI summary generation would fail.

### `server/src/ai/ai.service.ts`

Belongs to: backend

What it does:

- Reads `GEMINI_API_KEY`.
- Reads `GEMINI_MODEL`.
- Creates a Gemini client.
- Builds a structured sprint summary prompt.
- Calls `ai.models.generateContent`.
- Returns trimmed response text.
- Converts Gemini failures into HTTP-friendly Nest exceptions.

Why it exists:

- Keeps AI integration server-side.
- Protects the Gemini API key.
- Centralizes prompt construction and error handling.

Other files that depend on it:

- `server/src/ai/ai.module.ts`
- `server/src/sprint/sprint.controller.ts`

What would break if removed:

- `/sprint/summary` could not generate an AI summary.
- Gemini integration would be gone.

### `server/src/integrations/github/github-integration.module.ts`

Belongs to: backend

What it does:

- Registers GitHub integration controller and service.

Why it exists:

- Groups optional GitHub Actions integration code.

Other files that depend on it:

- `server/src/app.module.ts`

Files it depends on:

- `server/src/integrations/github/github-integration.controller.ts`
- `server/src/integrations/github/github-integration.service.ts`

What would break if removed:

- `GET /integrations/github/actions` would not be registered.
- GitHub workflow card would fail to load data.

### `server/src/integrations/github/github-integration.controller.ts`

Belongs to: backend

What it does:

- Defines `GET /integrations/github/actions`.
- Delegates to `GitHubIntegrationService`.

Why it exists:

- Provides the HTTP endpoint used by the frontend GitHub card.

Other files that depend on it:

- `server/src/integrations/github/github-integration.module.ts`
- `client/src/features/integrations/github-actions-card.tsx` depends on its endpoint at runtime.

Files it depends on:

- `server/src/integrations/github/github-integration.service.ts`
- `server/src/integrations/github/github-integration.types.ts`

What would break if removed:

- The GitHub Actions API endpoint would disappear.
- The frontend GitHub card would show an error.

### `server/src/integrations/github/github-integration.service.ts`

Belongs to: backend

What it does:

- Reads `GITHUB_OWNER`.
- Reads `GITHUB_REPO`.
- Reads optional `GITHUB_TOKEN`.
- Returns an empty array if owner or repo is missing.
- Calls GitHub Actions workflow runs API.
- Maps GitHub workflow run fields into `SimplifiedWorkflowRun`.

Why it exists:

- Keeps GitHub API logic out of the controller.
- Provides a clean backend shape for the frontend.

Other files that depend on it:

- `server/src/integrations/github/github-integration.controller.ts`
- `server/src/integrations/github/github-integration.module.ts`

Files it depends on:

- `server/src/integrations/github/github-integration.types.ts`

What would break if removed:

- GitHub endpoint would have no implementation.
- Frontend GitHub workflow card could not load real workflow data.

### `server/src/integrations/github/github-integration.types.ts`

Belongs to: backend

What it does:

- Defines `SimplifiedWorkflowRun`.

Why it exists:

- Gives the GitHub integration response a clear TypeScript shape.

Other files that depend on it:

- `server/src/integrations/github/github-integration.controller.ts`
- `server/src/integrations/github/github-integration.service.ts`

What would break if removed:

- TypeScript imports would fail.
- GitHub integration files would not compile.

### `server/.env.example`

Belongs to: backend

What it does:

- Documents backend environment variables:
  - `PORT`
  - `CLIENT_URL`
  - `CLERK_SECRET_KEY`
  - `CLERK_AUTHORIZED_PARTIES`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL`
  - `GITHUB_OWNER`
  - `GITHUB_REPO`
  - `GITHUB_TOKEN`

Why it exists:

- Helps developers create `server/.env`.
- Documents deployment configuration.

Other files that depend on it:

- No source files import it directly.
- Developers, Docker Compose setup, and deployment docs depend on it.

What would break if removed:

- The backend could still run if real env vars exist.
- New developers would likely misconfigure auth, CORS, Gemini, or GitHub integration.

### `server/package.json`

Belongs to: backend

What it does:

- Defines backend dependencies.
- Defines scripts:
  - `build`
  - `start`
  - `start:dev`
  - `start:prod`
  - `lint`
  - `test`
  - `test:e2e`

Why it exists:

- pnpm and Docker need it to install and run the backend.

Other files that depend on it:

- `server/Dockerfile`
- Root workspace scripts
- Local development commands

What would break if removed:

- Backend dependencies could not be installed normally.
- Backend Docker build would fail.
- NestJS scripts would disappear.

### `server/tsconfig.json`

Belongs to: backend

What it does:

- Configures TypeScript for backend development.

Why it exists:

- Required for TypeScript compilation and editor tooling.

Other files that depend on it:

- Nest build tools.
- TypeScript tooling.
- Tests.

What would break if removed:

- Backend TypeScript compilation would likely fail.

### `server/tsconfig.build.json`

Belongs to: backend

What it does:

- Defines TypeScript build settings for production output.

Why it exists:

- Lets `nest build` compile the backend into `dist/`.

Other files that depend on it:

- `server/package.json` build script.
- `server/Dockerfile` build target.

What would break if removed:

- Backend production build may fail.

### `server/nest-cli.json`

Belongs to: backend

What it does:

- Configures the Nest CLI.

Why it exists:

- Tells Nest how to build and run the project.

Other files that depend on it:

- `nest build`
- `nest start`

What would break if removed:

- Nest CLI commands may fail or use incorrect defaults.

## DevOps Files

### `docker-compose.yml`

Belongs to: devops

What it does:

- Defines local development services:
  - `server`
  - `client`
- Builds each service from its Dockerfile.
- Uses each Dockerfile's `dev` target.
- Loads `server/.env`.
- Loads `client/.env.local`.
- Maps ports:
  - backend `4000:4000`
  - frontend `3000:3000`
- Mounts source directories for live development.
- Keeps container `node_modules` isolated with anonymous volumes.

Why it exists:

- Lets the full app run locally with one command: `pnpm dev`.

Other files that depend on it:

- Root `package.json` scripts.

Files it depends on:

- `server/Dockerfile`
- `client/Dockerfile`
- `server/.env`
- `client/.env.local`

What would break if removed:

- Docker-based local development would no longer work.
- Root `pnpm dev` would fail.

### `client/Dockerfile`

Belongs to: devops

What it does:

- Defines Docker stages for the frontend:
  - `base`
  - `deps`
  - `dev`
  - `build`
  - `prod`
- Uses Node 20 Alpine.
- Enables pnpm through Corepack.
- Installs dependencies.
- Runs Next.js in dev or production mode depending on target.

Why it exists:

- Containerizes the frontend for local Docker and Render deployment.

Other files that depend on it:

- `docker-compose.yml`
- Render frontend service

Files it depends on:

- `client/package.json`
- `client/pnpm-lock.yaml`
- frontend source files during build

What would break if removed:

- Frontend Docker Compose service could not build.
- Frontend Render Docker deployment would fail.

### `server/Dockerfile`

Belongs to: devops

What it does:

- Defines Docker stages for the backend:
  - `base`
  - `deps`
  - `dev`
  - `build`
  - `prod`
- Uses Node 20 Alpine.
- Enables pnpm through Corepack.
- Installs dependencies.
- Runs NestJS in dev or production mode depending on target.

Why it exists:

- Containerizes the backend for local Docker and Render deployment.

Other files that depend on it:

- `docker-compose.yml`
- Render backend service

Files it depends on:

- `server/package.json`
- `server/pnpm-lock.yaml`
- backend source files during build

What would break if removed:

- Backend Docker Compose service could not build.
- Backend Render Docker deployment would fail.

### `package.json`

Belongs to: devops

What it does:

- Defines root project metadata.
- Defines root scripts:
  - `dev`
  - `dev:local`
  - `client:dev`
  - `server:dev`
  - `build`
  - `lint`
- Pins package manager to pnpm.

Why it exists:

- Provides one command surface for the monorepo.

Other files that depend on it:

- Developers and CI commands.
- pnpm workspace behavior.

Files it depends on:

- `pnpm-workspace.yaml`
- `client/package.json`
- `server/package.json`
- `docker-compose.yml`

What would break if removed:

- Root-level commands would disappear.
- Monorepo workflow would be much harder to use.

### `pnpm-workspace.yaml`

Belongs to: devops

What it does:

- Registers workspace packages:
  - `client`
  - `server`

Why it exists:

- Lets pnpm run workspace commands across both apps.

Other files that depend on it:

- Root `package.json` scripts using `pnpm -r` and `pnpm --filter`.

What would break if removed:

- pnpm would not treat the repo as a workspace.
- Filtered and recursive scripts would fail or behave incorrectly.

### `pnpm-lock.yaml`

Belongs to: devops

What it does:

- Locks root workspace dependency resolution.

Why it exists:

- Keeps installs reproducible.

Other files that depend on it:

- pnpm install workflows.

What would break if removed:

- Installs may still work, but dependency versions would be less reproducible.

### `client/pnpm-lock.yaml`

Belongs to: devops

What it does:

- Locks frontend dependency versions for the `client` package.

Why it exists:

- `client/Dockerfile` copies it and runs `pnpm install --frozen-lockfile`.

Other files that depend on it:

- `client/Dockerfile`

What would break if removed:

- Frontend Docker build would fail unless the Dockerfile were changed.

### `server/pnpm-lock.yaml`

Belongs to: devops

What it does:

- Locks backend dependency versions for the `server` package.

Why it exists:

- `server/Dockerfile` copies it and runs `pnpm install --frozen-lockfile`.

Other files that depend on it:

- `server/Dockerfile`

What would break if removed:

- Backend Docker build would fail unless the Dockerfile were changed.

## Documentation Files

### `README.md`

Belongs to: documentation

What it does:

- Explains the project goal.
- Lists features.
- Documents tech stack.
- Shows architecture.
- Explains local setup.
- Lists env vars.
- Lists endpoints and Socket.IO events.
- Documents deployment notes and future improvements.

Why it exists:

- It is the main entry point for someone reviewing or running the project.

Other files that depend on it:

- No code depends on it.
- Developers, interviewers, and portfolio reviewers depend on it.

What would break if removed:

- The app would still run.
- Project onboarding and explanation would be weaker.

### `docs/deployment.md`

Belongs to: documentation

What it does:

- Explains Render deployment.
- Documents backend and frontend service setup.
- Lists production environment variables.
- Explains common deployment troubleshooting.

Why it exists:

- Render deployment has multiple services and cross-service URLs, so it needs a clear guide.

Other files that depend on it:

- No code depends on it.
- Developers deploying the app depend on it.

What would break if removed:

- The app would still run locally.
- Deployment knowledge would be less discoverable.

### `docs/case-study.md`

Belongs to: documentation

What it does:

- Explains the project as a portfolio case study.
- Covers problem, solution, architecture, decisions, results, and future improvements.

Why it exists:

- Helps communicate the project in interviews and CV contexts.

Other files that depend on it:

- No code depends on it.

What would break if removed:

- The app would still run.
- Portfolio storytelling would be weaker.

### `docs/codebase-walkthrough.md`

Belongs to: documentation

What it does:

- Gives a beginner-friendly architecture walkthrough.
- Explains frontend and backend flows.
- Includes Mermaid diagrams.
- Provides interview explanations and future improvements.

Why it exists:

- Helps a developer understand how the whole codebase fits together.

Other files that depend on it:

- No code depends on it.

What would break if removed:

- The app would still run.
- Developers would lose a guided architecture explanation.

### `docs/files-walkthrough.md`

Belongs to: documentation

What it does:

- This file.
- Explains important files one by one.
- Describes dependencies and failure impact.

Why it exists:

- Helps developers learn the repository by reading files in context.

Other files that depend on it:

- No code depends on it.

What would break if removed:

- The app would still run.
- The file-by-file learning map would be gone.

## Request Flow Dependency Chains

### Sign-In And AI Summary

```text
client/src/app/layout.tsx
  -> ClerkProvider
  -> client/src/features/sprint-summary/sprint-summary-card.tsx
  -> client/src/lib/api.ts
  -> server/src/sprint/sprint.controller.ts
  -> server/src/auth/clerk-auth.guard.ts
  -> server/src/sprint/sprint.service.ts
  -> server/src/ai/ai.service.ts
```

### Live Pipeline Updates

```text
client/src/app/page.tsx
  -> client/src/features/pipelines/pipeline-feed.tsx
  -> client/src/lib/socket.ts
  -> server/src/pipelines/pipelines.gateway.ts
  -> server/src/pipelines/pipelines.service.ts
```

### GitHub Workflow Runs

```text
client/src/app/page.tsx
  -> client/src/features/integrations/github-actions-card.tsx
  -> client/src/lib/api.ts
  -> server/src/integrations/github/github-integration.controller.ts
  -> server/src/integrations/github/github-integration.service.ts
```

### Backend Startup

```text
server/src/main.ts
  -> server/src/app.module.ts
  -> backend feature modules
  -> controllers, services, gateways, guards
```

### Docker Local Development

```text
package.json
  -> docker-compose.yml
  -> client/Dockerfile
  -> server/Dockerfile
  -> client/.env.local
  -> server/.env
```

## Suggested Reading Order

1. `README.md`
2. `docker-compose.yml`
3. `client/src/app/layout.tsx`
4. `client/src/app/page.tsx`
5. `client/src/lib/query-provider.tsx`
6. `client/src/lib/api.ts`
7. `client/src/lib/socket.ts`
8. `client/src/features/pipelines/pipeline-feed.tsx`
9. `client/src/features/sprint-summary/sprint-summary-card.tsx`
10. `client/src/features/integrations/github-actions-card.tsx`
11. `server/src/main.ts`
12. `server/src/app.module.ts`
13. `server/src/auth/clerk-auth.guard.ts`
14. `server/src/pipelines/pipelines.module.ts`
15. `server/src/pipelines/pipelines.controller.ts`
16. `server/src/pipelines/pipelines.service.ts`
17. `server/src/pipelines/pipelines.gateway.ts`
18. `server/src/sprint/sprint.module.ts`
19. `server/src/sprint/sprint.controller.ts`
20. `server/src/sprint/sprint.service.ts`
21. `server/src/ai/ai.module.ts`
22. `server/src/ai/ai.service.ts`
23. `server/src/integrations/github/github-integration.module.ts`
24. `server/src/integrations/github/github-integration.controller.ts`
25. `server/src/integrations/github/github-integration.service.ts`
26. `docs/deployment.md`
27. `docs/codebase-walkthrough.md`

