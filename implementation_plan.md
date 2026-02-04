# Deployment Readiness Plan

## Goal
Prepare the application for deployment by removal hardcoded localhost references and enabling configuration via environment variables.

## User Review Required
> [!IMPORTANT]
> This plan prepares the code for deployment but does not perform the actual deployment. To go live, you will need to:
> 1. Push this code to GitHub.
> 2. Connect the repository to hosting platforms (e.g., Vercel for Frontend, Render/Railway for Backend).
> 3. Configure the environment variables on those platforms.

## Proposed Changes

### Frontend
#### [MODIFY] [api.ts](file:///C:/Users/yshra/Desktop/AI%20Internship/frontend/src/lib/api.ts)
- Update `baseURL` to use `process.env.NEXT_PUBLIC_API_URL`.
- Fallback to `http://127.0.0.1:8000/api/v1` for local development.

#### [NEW] .env.local
- Create a local env file setting `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1` to explicitly define it for local dev.

### Backend
#### [MODIFY] [config.py](file:///C:/Users/yshra/Desktop/AI%20Internship/backend/core/config.py)
- Add `BACKEND_CORS_ORIGINS` to `Settings`.
- Logic to parse a comma-separated string of origins (e.g. `http://localhost:3000,https://myapp.vercel.app`).

#### [MODIFY] [main.py](file:///C:/Users/yshra/Desktop/AI%20Internship/backend/main.py)
- Update `CORSMiddleware` to use `settings.BACKEND_CORS_ORIGINS`.

## Verification Plan
1. **Frontend**: Verify `npm run dev` still connects to backend.
2. **Backend**: Verify `uvicorn` still serves requests from frontend.
