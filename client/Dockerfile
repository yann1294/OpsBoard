FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/package.json
RUN pnpm install --filter ./client... --frozen-lockfile

FROM deps AS dev
EXPOSE 3000
CMD ["pnpm", "--filter", "./client", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

FROM deps AS build
COPY client ./client
RUN pnpm --filter ./client build

FROM base AS prod
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY --from=build /app/client/.next ./client/.next
COPY --from=build /app/client/public ./client/public
COPY --from=build /app/client/next.config.ts ./client/next.config.ts
COPY --from=build /app/client/package.json ./client/package.json
WORKDIR /app/client
EXPOSE 3000
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
