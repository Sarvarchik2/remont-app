from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.features.stories.models import Story

router = APIRouter()

@router.get("/")
async def get_all_stories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Story))
    items = result.scalars().all()
    # Pydantic is cleaner but returning dict simplifies our quick setup
    return items

@router.post("/")
async def create_stories(data: dict, db: AsyncSession = Depends(get_db)):
    item_id = data.get("id") or (data.get("id", "new") if "id" in data else None)
    
    # Simple object creation without complex schema validation
    new_item = Story(**data)
    
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

@router.post("/batch")
async def create_batch_stories(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    items = [Story(**data) for data in data_list]
    db.add_all(items)
    await db.commit()
    return {"message": "Batch inserted"}

