from typing import Any, List
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from api import deps
from core import security
from db.session import get_db
from models.user import User
from schemas import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
        
    obj_in_data = jsonable_encoder(user_in)
    del obj_in_data["password"]
    obj_in_data["hashed_password"] = security.get_password_hash(user_in.password)
    
    db_obj = User(**obj_in_data)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    
    return db_obj

@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
