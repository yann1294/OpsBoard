FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

FROM base AS deps
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

FROM deps AS dev
EXPOSE 3000
CMD ["pnpm", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

FROM deps AS build
COPY . .
RUN pnpm build

FROM base AS prod
COPY package.json ./
RUN pnpm install --prod --no-frozen-lockfile
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
EXPOSE 3000
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
