from sqlalchemy.ext.asyncio import AsyncSession
from app.features.projects.repository import ProjectsRepository

class ProjectsService:
    def __init__(self, session: AsyncSession):
        self.repository = ProjectsRepository(session)
