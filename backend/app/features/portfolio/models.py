from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, JSON
from app.core.database import Base

class PortfolioItem(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # 'living' | 'kitchen' | 'bath' | 'bedroom'
    title = Column(String)
    imgBefore = Column(String)
    imgAfter = Column(String)
    area = Column(String)
    term = Column(String)
    cost = Column(String, nullable=True)
    location = Column(String, nullable=True)
    isNewBuilding = Column(Boolean, default=False)
    
    tags = Column(JSON, nullable=True)
    description = Column(String, nullable=True)
    worksCompleted = Column(JSON, nullable=True)
    budget = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    team = Column(JSON, nullable=True)
    materials = Column(JSON, nullable=True)
    gallery = Column(JSON, nullable=True)
    videoUrl = Column(String, nullable=True)
