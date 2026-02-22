from sqlalchemy.ext.asyncio import AsyncSession
from app.features.leads.repository import LeadsRepository

class LeadsService:
    def __init__(self, session: AsyncSession):
        self.repository = LeadsRepository(session)
