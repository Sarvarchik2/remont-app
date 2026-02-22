from sqlalchemy import Column, Integer, JSON
from app.core.database import Base

class CalculatorSetting(Base):
    """ Singleton or multi-row table to store prices like `new: {economy, standard, premium}` """
    __tablename__ = "calculator_settings"
    id = Column(Integer, primary_key=True, index=True)
    prices = Column(JSON) # e.g. { "new": {"economy": ...}, "secondary": {"economy":...} }
