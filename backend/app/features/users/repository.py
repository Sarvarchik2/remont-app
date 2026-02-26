from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.features.users.models import User
from app.features.users.schemas import UserCreate
from typing import Optional

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_telegram_id(self, telegram_id: str) -> Optional[User]:
        """ Fetch user by telegram ID from db """
        result = await self.session.execute(select(User).where(User.telegram_id == telegram_id))
        return result.scalars().first()

    async def get_all(self) -> list[User]:
        """ Fetch all users from db """
        result = await self.session.execute(select(User))
        return result.scalars().all()

    async def create(self, user_in: UserCreate) -> User:
        """ Save a new user to db """
        db_user = User(
            telegram_id=user_in.telegram_id,
            username=user_in.username,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            phone=user_in.phone
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user
