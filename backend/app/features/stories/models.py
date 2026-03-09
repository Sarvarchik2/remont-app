from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Story(Base):
    __tablename__ = "stories"
    id = Column(String, primary_key=True, index=True)
    category = Column(String) # 'process' | 'reviews' | 'team' | 'promo'
    imageUrl = Column(String)
    title = Column(JSON) # e.g. { "ru": "...", "uz": "..." }
    videoUrl = Column(String, nullable=True)
    linkUrl = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
