# 🚀 AI Career Acceleration Platform

> An intelligent career management platform powered by AI that helps job seekers optimize their resumes, track applications, and match with relevant opportunities.

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The AI Career Acceleration Platform is a full-stack web application designed to streamline the job search process. It leverages Google's Gemini AI to provide intelligent resume analysis, personalized job recommendations, and application tracking capabilities.

## ✨ Key Features

- **🤖 AI-Powered Resume Analysis**: Upload resumes (PDF/DOCX) and get instant AI-driven insights and improvement suggestions
- **💼 Smart Job Matching**: AI-based job recommendations tailored to your skills and experience
- **📊 Application Tracking**: Kanban-style board to manage job applications across different stages
- **🔐 Secure Authentication**: JWT-based authentication with password hashing
- **📄 Document Processing**: Advanced PDF and DOCX parsing for resume extraction
- **🎨 Modern UI**: Responsive design with dark mode support and smooth animations
- **⚡ Real-time Updates**: Fast, reactive interface using React Query for data synchronization

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query (v5)
- **Drag & Drop**: @hello-pangea/dnd
- **UI Components**: Custom components with Radix UI primitives
- **TypeScript**: Full type safety

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with pgvector extension
- **ORM**: SQLAlchemy 2.0 (Async)
- **Authentication**: JWT tokens with python-jose
- **Password Hashing**: Passlib with bcrypt
- **AI Integration**: Google Generative AI (Gemini)
- **Document Processing**: pdfplumber, python-docx
- **Migrations**: Alembic

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15+
- **Cache/Queue**: Redis (optional)

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 20+** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** (or SQLite for local development)
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd AI-Internship
```

#### 2️⃣ Backend Setup

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r ../requirements.txt

# Copy environment template
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux

# Edit .env with your configuration
# Required: DATABASE_URL, SECRET_KEY
# Optional: GOOGLE_API_KEY (for AI features)

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn main:app --reload
```

Backend will be available at: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

#### 3️⃣ Frontend Setup

```powershell
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/login` | User login (returns JWT token) |
| POST | `/api/v1/users/` | User registration |
| GET | `/api/v1/users/me` | Get current user profile |

### Resume Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/resumes/` | Upload and analyze resume |
| GET | `/api/v1/resumes/` | List all user resumes |
| GET | `/api/v1/resumes/{id}` | Get specific resume details |
| DELETE | `/api/v1/resumes/{id}` | Delete a resume |
| POST | `/api/v1/resumes/{id}/analyze` | Re-analyze resume with AI |

### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/jobs/` | Create job application |
| GET | `/api/v1/jobs/` | List all job applications |
| GET | `/api/v1/jobs/{id}` | Get job application details |
| PUT | `/api/v1/jobs/{id}` | Update job application |
| DELETE | `/api/v1/jobs/{id}` | Delete job application |
| POST | `/api/v1/jobs/match` | Get AI-powered job matches |

### Interactive API Docs
Visit **http://localhost:8000/docs** for interactive Swagger documentation with request/response examples.

## 📁 Project Structure

```
AI-Internship/
├── backend/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/    # API route handlers
│   │   │   └── api.py        # API router
│   │   └── deps.py           # Dependencies (auth, DB)
│   ├── core/
│   │   ├── config.py         # Configuration
│   │   └── security.py       # Auth utilities
│   ├── db/
│   │   ├── base.py           # Database models registry
│   │   └── session.py        # Database session
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   ├── migrations/           # Alembic migrations
│   ├── main.py               # FastAPI app entry
│   └── .env.example          # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities & API client
│   │   └── store/            # Zustand stores
│   ├── public/               # Static assets
│   └── package.json
├── requirements.txt          # Python dependencies
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Database (choose one)
DATABASE_URL=sqlite+aiosqlite:///./sql_app.db  # For local development
# DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/dbname  # For production

# Security (REQUIRED)
SECRET_KEY=your-secret-key-here  # Generate with: openssl rand -hex 32

# AI Features (OPTIONAL)
GOOGLE_API_KEY=your-gemini-api-key  # Get from: https://makersuite.google.com/app/apikey

# Redis (OPTIONAL - for background tasks)
# REDIS_URL=redis://localhost:6379/0
```

### Frontend

No environment variables required for basic setup. API calls default to `http://localhost:8000`.

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError` when starting backend
```powershell
# Solution: Ensure virtual environment is activated and dependencies installed
.\venv\Scripts\activate
pip install -r ../requirements.txt
```

**Problem**: Database connection errors
```powershell
# Solution: Check DATABASE_URL in .env
# For SQLite (local dev): DATABASE_URL=sqlite+aiosqlite:///./sql_app.db
# For PostgreSQL: Ensure PostgreSQL is running and credentials are correct
```

**Problem**: Alembic migration errors
```powershell
# Solution: Reset migrations (WARNING: deletes data)
alembic downgrade base
alembic upgrade head
```

### Frontend Issues

**Problem**: `npm install` fails
```powershell
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json  # On macOS/Linux
# Remove-Item -Recurse -Force node_modules, package-lock.json  # On Windows
npm install
```

**Problem**: API connection refused
```
# Solution: Ensure backend is running on http://localhost:8000
# Check backend terminal for errors
```

**Problem**: Build errors with Next.js
```powershell
# Solution: Clear Next.js cache
rm -rf .next  # On macOS/Linux
# Remove-Item -Recurse -Force .next  # On Windows
npm run dev
```

### Common Issues

**Problem**: Port already in use
```powershell
# Backend (8000): Change port in uvicorn command
uvicorn main:app --reload --port 8001

# Frontend (3000): Next.js will prompt to use 3001 automatically
```

**Problem**: CORS errors
```
# Solution: Ensure backend CORS settings allow frontend origin
# Check backend/main.py for CORS middleware configuration
```

## 📝 Usage

1. **Register an account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Upload a resume** (PDF or DOCX) to get AI analysis
4. **Add job applications** and track them on the Kanban board
5. **Get AI-powered job matches** based on your resume

## 🤝 Contributing

This project was developed as part of an internship application. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Generative AI (Gemini) for AI capabilities
- FastAPI and Next.js communities for excellent documentation
- All open-source contributors whose libraries made this possible

---

**Note**: This is a demonstration project for internship applications. For production deployment, additional security hardening, monitoring, and scalability considerations are required.
