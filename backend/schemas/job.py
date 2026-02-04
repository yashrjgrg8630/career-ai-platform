from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class JobBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    status: Optional[str] = "APPLIED"
    salary_range: Optional[str] = None
    job_url: Optional[str] = None
    description: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    title: Optional[str] = None
    company: Optional[str] = None
    pass

class JobInDBBase(JobBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Job(JobInDBBase):
    pass
