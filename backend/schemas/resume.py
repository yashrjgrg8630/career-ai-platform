from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel

class ResumeBase(BaseModel):
    filename: str
    content_type: str

class ResumeCreate(ResumeBase):
    pass

class ResumeInDBBase(ResumeBase):
    id: int
    user_id: int
    is_analyzed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Resume(ResumeInDBBase):
    raw_text: Optional[str] = None
    parsed_content: Optional[Any] = None


class ResumeDetail(Resume):
    pass

