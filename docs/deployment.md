# OpsBoard Render Deployment

This guide deploys OpsBoard as two Render Web Services:

1. `opsboard-api` (NestJS backend)
2. `opsboard-web` (Next.js frontend)

---

## 1) Backend Service: `opsboard-api`

- **Service Type:** Web Service
- **Root Directory:** `server`
- **Runtime:** Docker
- **Health Check Path:** `/health`

### Environment Variables

- `PORT=4000`
- `CLIENT_URL=<frontend-render-url>`
- `CLERK_SECRET_KEY=<your-clerk-secret-key>`
- `GEMINI_API_KEY=<your-gemini-api-key>`
- `GEMINI_MODEL=gemini-3-flash-preview`

---

## 2) Frontend Service: `opsboard-web`

- **Service Type:** Web Service
- **Root Directory:** `client`
- **Runtime:** Docker

### Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>`
- `CLERK_SECRET_KEY=<your-clerk-secret-key>`
- `NEXT_PUBLIC_API_URL=<backend-render-url>`
- `NEXT_PUBLIC_SOCKET_URL=<backend-render-url>`

---

## URL Wiring

- Set backend `CLIENT_URL` to your deployed frontend URL.
- Set frontend `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- Set frontend `NEXT_PUBLIC_SOCKET_URL` to the same backend URL used by Socket.IO.

Use full `https://...onrender.com` URLs for all cross-service variables.

---

## Common Troubleshooting

### 1) CORS issue

- Ensure backend `CLIENT_URL` exactly matches the frontend Render URL (including `https`).
- Redeploy backend after updating env vars.

### 2) Missing env vars

- Check Render dashboard for both services and confirm all required variables are present.
- Missing values typically cause startup failures or 401/500 API responses.

### 3) Clerk token issue

- Confirm frontend sends `Authorization: Bearer <token>` for protected endpoints.
- Verify `CLERK_SECRET_KEY` belongs to the same Clerk instance as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

### 4) Gemini API key issue

- Confirm `GEMINI_API_KEY` is set on `opsboard-api`.
- If `/sprint/summary` fails, check backend logs for Gemini auth/model errors.

### 5) Socket.IO not connecting

- Verify frontend `NEXT_PUBLIC_SOCKET_URL` points to backend Render URL.
- Confirm backend service is healthy and reachable.
- Check browser console for websocket connection errors and backend logs for gateway activity.
