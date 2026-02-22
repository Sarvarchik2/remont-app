from sqlalchemy.ext.asyncio import AsyncSession
from app.features.users.repository import UserRepository
from app.features.users.schemas import UserCreate
from app.features.users.models import User

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
            # We can also update fields if they changed, omitted for brevity
            return existing_user
        
        # Additional business rules can be validated here
        return await self.repository.create(user_in)

    from typing import Optional
    async def get_user_by_telegram_id(self, telegram_id: str) -> Optional[User]:
        """
        Retrieve a user. Further logic can be placed here if necessary.
        """
        return await self.repository.get_by_telegram_id(telegram_id)
