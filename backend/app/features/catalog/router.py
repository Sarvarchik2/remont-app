from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.features.catalog.models import CatalogItem

router = APIRouter()

@router.get("/")
async def get_all_catalog(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CatalogItem))
    items = result.scalars().all()
    # Pydantic is cleaner but returning dict simplifies our quick setup
    return items

@router.post("/")
async def create_or_update_catalog(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = CatalogItem(**data)
    await db.merge(new_item)
    await db.commit()
    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_catalog(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    for data in data_list:
        item = CatalogItem(**data)
        await db.merge(item)
    await db.commit()
    return {"message": "Batch upserted"}

