from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from api import deps
from db.session import get_db
from models.job import Job
from models.user import User
from schemas import Job as JobSchema, JobCreate, JobUpdate

router = APIRouter()

@router.get("/", response_model=List[JobSchema])
async def read_jobs(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve jobs.
    """
    result = await db.execute(select(Job).where(Job.user_id == current_user.id).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=JobSchema)
async def create_job(
    *,
    db: AsyncSession = Depends(get_db),
    job_in: JobCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new job.
    """
    db_obj = Job(**job_in.dict(), user_id=current_user.id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.put("/{id}", response_model=JobSchema)
async def update_job(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    job_in: JobUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a job.
    """
    result = await db.execute(select(Job).where(Job.id == id, Job.user_id == current_user.id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    update_data = job_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
        
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job

@router.delete("/{id}", response_model=JobSchema)
async def delete_job(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a job.
    """
    result = await db.execute(select(Job).where(Job.id == id, Job.user_id == current_user.id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    await db.delete(job)
    await db.commit()
    return job
