FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/package.json
RUN pnpm install --filter ./server... --frozen-lockfile

FROM deps AS dev
EXPOSE 4000
CMD ["pnpm", "--filter", "./server", "start:dev"]

FROM deps AS build
COPY server ./server
RUN pnpm --filter ./server build

FROM base AS prod
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/dist ./server/dist
COPY server/package.json ./server/package.json
WORKDIR /app/server
EXPOSE 4000
CMD ["pnpm", "start:prod"]
