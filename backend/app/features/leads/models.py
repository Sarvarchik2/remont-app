from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    source = Column(String) # 'calculator', 'booking', 'phone', 'other'
    status = Column(String, default='new') # 'new', 'contacted', 'measuring', 'contract', 'declined'
    date = Column(String)
    time = Column(String)
    
    # Store dynamic data as JSON for simplicity (matching TS interface)
    calculatorData = Column(JSON, nullable=True)
    bookingData = Column(JSON, nullable=True)
    notes = Column(String, nullable=True)
