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
async def create_{feature}(data: dict, db: AsyncSession = Depends(get_db)):
    item_id = data.get("id") or (data.get("id", "new") if "id" in data else None)
    
    # Simple object creation without complex schema validation
    new_item = {model}(**data)
    
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

@router.post("/batch")
async def create_batch_{feature}(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    items = [{model}(**data) for data in data_list]
    db.add_all(items)
    await db.commit()
    return {{"message": "Batch inserted"}}

'''
    with open(f"app/features/{feature}/router.py", "w") as f:
        f.write(code)

print("Updated routers!")
