from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base

class Job(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    
    title = Column(String, index=True, nullable=False)
    company = Column(String, index=True, nullable=False)
    location = Column(String, nullable=True)
    status = Column(String, default="APPLIED", index=True) # SAVED, APPLIED, INTERVIEWING, OFFER, REJECTED
    salary_range = Column(String, nullable=True)
    job_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="jobs")

# Add backref to User model
from models.user import User
User.jobs = relationship("Job", back_populates="user", cascade="all, delete-orphan")
