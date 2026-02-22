from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Telegram Web App Backend"
    # Using SQLite with aiosqlite for simplicity in development
    # Can be changed to asyncpg for PostgreSQL
    DATABASE_URL: str = "sqlite+aiosqlite:///./db.sqlite3"
    
    class Config:
        env_file = ".env"

settings = Settings()
