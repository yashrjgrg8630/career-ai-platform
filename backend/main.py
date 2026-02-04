from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.v1.api import api_router
from core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered career management system backend",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Configuration - Allow frontend to communicate with backend
# CORS Configuration - Always allow specific origins or wildcard for now
origins = ["*"]
if settings.BACKEND_CORS_ORIGINS:
    origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to the Career Acceleration Platform API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Auto-run migrations on startup (for Render)
from alembic.config import Config
from alembic import command
import os

@app.on_event("startup")
async def startup_event():
    # Only run if we are in production or seemingly so
    # Adjust condition as needed, or just run it always for this simple app
    try:
        print("Running database migrations...")
        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
        print("Migrations completed successfully.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
