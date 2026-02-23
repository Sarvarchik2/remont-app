from sqlalchemy import Column, String, JSON
from app.core.database import Base

class ServiceCategory(Base):
    __tablename__ = "service_categories"
    id = Column(String, primary_key=True, index=True)
    title = Column(JSON)
    icon = Column(String)
    # Store items as JSON array instead of relationship
    services = Column(JSON, nullable=True)
