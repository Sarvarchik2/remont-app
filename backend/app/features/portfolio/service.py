from sqlalchemy.ext.asyncio import AsyncSession
from app.features.portfolio.repository import PortfolioRepository

class PortfolioService:
    def __init__(self, session: AsyncSession):
        self.repository = PortfolioRepository(session)
