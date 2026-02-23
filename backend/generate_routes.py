import os

features_models = {
    "leads": "Lead",
    "projects": "Project",
    "portfolio": "PortfolioItem",
    "catalog": "CatalogItem",
    "services": "ServiceCategory",
    "stories": "Story",
    "settings": "CalculatorSetting"
}

for feature, model in features_models.items():
    code = f'''from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.features.{feature}.models import {model}

router = APIRouter()

@router.get("/")
async def get_all_{feature}(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select({model}))
    items = result.scalars().all()
    # Pydantic is cleaner but returning dict simplifies our quick setup
    return items

@router.post("/")
async def create_or_update_{feature}(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = {model}(**data)
    await db.merge(new_item)
    await db.commit()
    return {{"message": "Saved successfully"}}

@router.post("/batch")
async def create_batch_{feature}(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    for data in data_list:
        item = {model}(**data)
        await db.merge(item)
    await db.commit()
    return {{"message": "Batch upserted"}}

'''
    with open(f"app/features/{feature}/router.py", "w") as f:
        f.write(code)

print("Updated routers!")
