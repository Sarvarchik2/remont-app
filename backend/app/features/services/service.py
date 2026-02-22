from sqlalchemy.ext.asyncio import AsyncSession
from app.features.services.repository import ServicesRepository

class ServicesService:
    def __init__(self, session: AsyncSession):
        self.repository = ServicesRepository(session)
