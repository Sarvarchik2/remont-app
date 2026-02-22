from sqlalchemy.ext.asyncio import AsyncSession
from app.features.stories.repository import StoriesRepository

class StoriesService:
    def __init__(self, session: AsyncSession):
        self.repository = StoriesRepository(session)
