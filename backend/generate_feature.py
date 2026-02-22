import os

FEATURES = [
    "leads", "projects", "portfolio", "catalog", "services", "stories", "settings"
]

for feature in FEATURES:
    # schemas.py
    if not os.path.exists(f"app/features/{feature}/schemas.py"):
        with open(f"app/features/{feature}/schemas.py", "w") as f:
            f.write(f"from pydantic import BaseModel\n\nclass {feature.capitalize()}Base(BaseModel):\n    pass\n")
    
    # repository.py
    with open(f"app/features/{feature}/repository.py", "w") as f:
        f.write(f'''from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.features.{feature}.models import *

class {feature.capitalize()}Repository:
    def __init__(self, session: AsyncSession):
        self.session = session
        
    # Add generic CRUD methods here later depending on model
''')

    # service.py
    with open(f"app/features/{feature}/service.py", "w") as f:
        f.write(f'''from sqlalchemy.ext.asyncio import AsyncSession
from app.features.{feature}.repository import {feature.capitalize()}Repository

class {feature.capitalize()}Service:
    def __init__(self, session: AsyncSession):
        self.repository = {feature.capitalize()}Repository(session)
''')

    # router.py
    with open(f"app/features/{feature}/router.py", "w") as f:
        f.write(f'''from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.features.{feature}.service import {feature.capitalize()}Service

router = APIRouter()

def get_service(db: AsyncSession = Depends(get_db)):
    return {feature.capitalize()}Service(db)

@router.get("/")
async def get_all(service: {feature.capitalize()}Service = Depends(get_service)):
    return {{"message": "Not implemented yet"}}
''')

print("Generated boilerplate for all features")
