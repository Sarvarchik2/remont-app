from sqlalchemy import Column, String, Float, JSON
from app.core.database import Base

class CatalogItem(Base):
    __tablename__ = "catalog"

    id = Column(String, primary_key=True, index=True)
    category = Column(String) # 'materials' | 'furniture' | ...
    title = Column(JSON) # e.g. {"ru": "Name", "uz": "Name"}
    description = Column(JSON)
    price = Column(Float)
    image = Column(String)
    images = Column(JSON)
    specs = Column(JSON, nullable=True) # arrays of {label: {ru, uz}, value: {ru, uz}}
