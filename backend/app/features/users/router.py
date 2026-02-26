from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.users.schemas import UserCreate, UserResponse
from app.features.users.service import UserService

from typing import List

router = APIRouter()

def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)

@router.get("/", response_model=List[UserResponse])
async def get_users(
    service: UserService = Depends(get_user_service)
):
    """
    Get all registered users. Admin only (ideally, but simplified here).
    """
    return await service.list_users()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    service: UserService = Depends(get_user_service)
):
    """
    Endpoint for registering a new user via Telegram Web App.
    """
    user = await service.register_telegram_user(user_in)
    return user

@router.get("/{telegram_id}", response_model=UserResponse)
async def get_user(
    telegram_id: str,
    service: UserService = Depends(get_user_service)
):
    """
    Get existing Telegram user by ID.
    """
    user = await service.get_user_by_telegram_id(telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
