from sqlalchemy.ext.asyncio import AsyncSession
from app.features.settings.repository import SettingsRepository

class SettingsService:
    def __init__(self, session: AsyncSession):
        self.repository = SettingsRepository(session)
