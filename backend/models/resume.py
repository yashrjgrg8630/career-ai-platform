from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base_class import Base

class Resume(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    file_path = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    
    # Analysis Data
    raw_text = Column(String, nullable=True)
    parsed_content = Column(JSON, nullable=True) # AI extracted structured data
    embedding = Column(String, nullable=True) # Placeholder for vector (pgvector needs specific type)
    
    is_analyzed = Column(Boolean(), default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="resumes")

# Add backref to User model (circular import handling usually needed, but for now just defining here)
from models.user import User
User.resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
