from sqlalchemy.ext.asyncio import AsyncSession
from app.features.catalog.repository import CatalogRepository

class CatalogService:
    def __init__(self, session: AsyncSession):
        self.repository = CatalogRepository(session)
