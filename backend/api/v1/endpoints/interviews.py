from typing import Any, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services import ai_service

router = APIRouter()

class InterviewRequest(BaseModel):
    job_title: str
    job_description: str = ""

class AnswerRequest(BaseModel):
    question: str
    answer: str

@router.post("/generate", response_model=List[str])
async def generate_questions(request: InterviewRequest) -> Any:
    """
    Generate interview questions based on job details
    """
    return await ai_service.generate_interview_questions(request.job_title, request.job_description)

@router.post("/evaluate", response_model=dict)
async def evaluate_answer(request: AnswerRequest) -> Any:
    """
    Evaluate an interview answer
    """
    return await ai_service.evaluate_interview_answer(request.question, request.answer)
