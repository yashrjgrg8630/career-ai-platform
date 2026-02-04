# Deployment Readiness Walkthrough

I have updated your application to support deployment to production environments (like Vercel and Render).

## Changes Made

### Frontend
1.  **Environment Variable for API URL**: Updated `src/lib/api.ts` to use `NEXT_PUBLIC_API_URL`.
2.  **Local Environment**: Created `.env.local` to keep `http://127.0.0.1:8000/api/v1` as the default for local development.

### Backend
1.  **CORS Configuration**: Updated `core/config.py` and `main.py` to allow allowed origins to be set via `BACKEND_CORS_ORIGINS`.
2.  **Local Environment**: Updated `.env` to allow `localhost` connections explicitly.

## Next Steps for Deployment

### 1. Frontend (e.g., Vercel)
When deploying your frontend, set the following environment variable in your project settings:
- `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://my-backend.onrender.com/api/v1`)

### 2. Backend (e.g., Render/Railway)
When deploying your backend, set the following environment variable:
- `BACKEND_CORS_ORIGINS`: Comma-separated list of your frontend URLs (e.g., `https://my-app.vercel.app,https://my-app-staging.vercel.app`)
