import shutil
import os
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from api import deps
from db.session import get_db
from models.resume import Resume
from models.user import User
from schemas import Resume as ResumeSchema
from services import pdf_service, ai_service

router = APIRouter()

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ResumeSchema)
async def upload_resume(
    *,
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a resume (PDF), extract text, and analyze it with AI.
    """
    if not file.filename.endswith(".pdf"):
         raise HTTPException(status_code=400, detail="Only PDF files are supported")
         
    file_location = f"{UPLOAD_DIR}/{current_user.id}_{file.filename}"
    
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Extract text (Sync for now, should be async/Celery in prod)
    try:
        raw_text = pdf_service.extract_text_from_pdf(file_location)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")
        
    # AI Analysis
    parsed_content = await ai_service.analyze_resume(raw_text)
    
    db_obj = Resume(
        user_id=current_user.id,
        file_path=file_location,
        filename=file.filename,
        content_type=file.content_type,
        raw_text=raw_text,
        parsed_content=parsed_content,
        is_analyzed=True
    )
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    
    return db_obj

@router.get("/", response_model=List[ResumeSchema])
async def read_resumes(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve resumes.
    """
    result = await db.execute(select(Resume).where(Resume.user_id == current_user.id).offset(skip).limit(limit))
    resumes = result.scalars().all()
    return resumes

from pydantic import BaseModel

class TailorRequest(BaseModel):
    resume_id: int
    job_description: str

@router.post("/tailor", response_model=dict)
async def tailor_resume(
    request: TailorRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Tailor a resume for a specific job description using AI.
    """
    result = await db.execute(select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id))
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    tailored_result = await ai_service.tailor_resume(resume.raw_text, request.job_description)
    return tailored_result

class ColdEmailRequest(BaseModel):
    resume_id: int
    recipient_name: str
    company_name: str
    job_title: str

@router.post("/cold-email", response_model=dict)
async def generate_cold_email(
    request: ColdEmailRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a cold email based on a resume and target details.
    """
    result = await db.execute(select(Resume).where(Resume.id == request.resume_id, Resume.user_id == current_user.id))
    resume = result.scalars().first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    email_result = await ai_service.generate_cold_email(
        resume.raw_text, 
        request.recipient_name, 
        request.company_name, 
        request.job_title
    )
    return email_result
