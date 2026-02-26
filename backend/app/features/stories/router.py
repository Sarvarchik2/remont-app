from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from app.core.database import get_db
from app.features.stories.models import Story

router = APIRouter()

@router.get("/")
async def get_all_stories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Story))
    items = result.scalars().all()
    return items

@router.post("/")
async def create_or_update_stories(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = Story(**data)
    await db.merge(new_item)
    await db.commit()
    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_stories(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    try:
        # 1. Clear current state (Batch sync means the client list is the source of truth)
        await db.execute(delete(Story))
        
        # 2. Add all items from the new list
        for data in data_list:
            # Filter dict to only include model keys to avoid unexpected fields
            # Story model has id, category, imageUrl, title, videoUrl
            allowed_keys = ['id', 'category', 'imageUrl', 'title', 'videoUrl']
            filtered_data = {k: v for k, v in data.items() if k in allowed_keys}
            
            item = Story(**filtered_data)
            db.add(item)
            
        await db.commit()
        return {"message": "Stories synchronized"}
    except Exception as e:
        await db.rollback()
        raise e

