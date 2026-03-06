from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Telegram Web App Backend"
    DATABASE_URL: str
    ADMIN_TELEGRAM_IDS: List[str] = ["123456789", "436423456"]
    TELEGRAM_BOT_TOKEN: str
    WEB_APP_URL: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
