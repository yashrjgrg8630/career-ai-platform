# Deployment Readiness Walkthrough

I have updated your application to support deployment to production environments (like Vercel and Render).

## Changes Made

### Frontend
1.  **Environment Variable for API URL**: Updated `src/lib/api.ts` to use `NEXT_PUBLIC_API_URL`.
2.  **Local Environment**: Created `.env.local` to keep `http://127.0.0.1:8000/api/v1` as the default for local development.

### Backend
1.  **CORS Configuration**: Updated `core/config.py` and `main.py` to allow allowed origins to be set via `BACKEND_CORS_ORIGINS`.
2.  **Local Environment**: Updated `.env` to allow `localhost` connections explicitly.
3.  **Git Configuration**: Initialized a Git repository and consolidated the project structure.

## Next Steps for Deployment

### 1. Push to GitHub (Completed)
- Your code is now live at: https://github.com/yashrjgrg8630/career-ai-platform

### 2. Frontend (Vercel)
1.  Go to [Vercel](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import `career-ai-platform` from your GitHub.
4.  In **Environment Variables**, add:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (see step 3).
5.  Click **Deploy**.

### 3. Backend (Render / Railway)
1.  Go to [Render](https://render.com) or [Railway](https://railway.app).
2.  Create a new **Web Service**.
3.  Connect your GitHub repo `career-ai-platform`.
4.  **Build Command**: `pip install -r requirements.txt` (Render usually detects this).
5.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
6.  **Environment Variables**:
    - `BACKEND_CORS_ORIGINS`: Your Vercel frontend URL (e.g., `https://career-ai-platform.vercel.app`).
    - `DATABASE_URL`: Your production database URL (Render provides one if you add a Postgres database).
    - `SECRET_KEY`: A strong random string.
When deploying your frontend, set the following environment variable in your project settings:
- `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://my-backend.onrender.com/api/v1`)

### 2. Backend (e.g., Render/Railway)
When deploying your backend, set the following environment variable:
- `BACKEND_CORS_ORIGINS`: Comma-separated list of your frontend URLs (e.g., `https://my-app.vercel.app,https://my-app-staging.vercel.app`)
