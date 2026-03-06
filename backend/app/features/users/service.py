from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.users.repository import UserRepository
from app.features.users.schemas import UserCreate
from app.features.users.models import User
from app.core.config import settings

class UserService:
    def __init__(self, session: AsyncSession):
        self.repository = UserRepository(session)

    async def register_telegram_user(self, user_in: UserCreate) -> User:
        """
        Business logic for Telegram User registration.
        Validates, prepares data, and calls the repository.
        """
        # First check if the user already exists
        existing_user = await self.repository.get_by_telegram_id(user_in.telegram_id)
        if existing_user:
            # Sync user info (name, photo, etc.) if it changed
            updated = False
            if existing_user.first_name != user_in.first_name:
                existing_user.first_name = user_in.first_name
                updated = True
            if existing_user.last_name != user_in.last_name:
                existing_user.last_name = user_in.last_name
                updated = True
            if existing_user.username != user_in.username:
                existing_user.username = user_in.username
                updated = True
            if user_in.photo_url and existing_user.photo_url != user_in.photo_url:
                existing_user.photo_url = user_in.photo_url
                updated = True
            
            is_admin = user_in.telegram_id in settings.ADMIN_TELEGRAM_IDS
            if existing_user.is_admin != is_admin:
                existing_user.is_admin = is_admin
                updated = True
            
            if updated:
                await self.repository.session.commit()
                await self.repository.session.refresh(existing_user)
            return existing_user
        
        # Additional business rules can be validated here
        return await self.repository.create(user_in)

    async def list_users(self) -> list[User]:
        """
        Retrieve all users.
        """
        return await self.repository.get_all()

    async def get_user_by_telegram_id(self, telegram_id: str) -> Optional[User]:
        """
        Retrieve a user. Further logic can be placed here if necessary.
        """
        return await self.repository.get_by_telegram_id(telegram_id)
