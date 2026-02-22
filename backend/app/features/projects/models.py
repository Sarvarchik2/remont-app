from sqlalchemy import Column, String, Float, Integer, ForeignKey, JSON
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    clientName = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)
    totalEstimate = Column(Float)
    startDate = Column(String)
    deadline = Column(String)
    status = Column(String) # 'new' | 'process' | 'finished'
    currentStage = Column(String)
    contractNumber = Column(String)
    
    stage = Column(String, nullable=True)
    forecast = Column(String, nullable=True)
    finance = Column(JSON, nullable=True)

    # Convert relations to JSON to easily serialize/deserialize complex nested types
    payments = Column(JSON, nullable=True)
    timeline = Column(JSON, nullable=True)
