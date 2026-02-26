from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from app.core.database import get_db
from app.features.services.models import ServiceCategory

router = APIRouter()

@router.get("/")
async def get_all_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceCategory))
    items = result.scalars().all()
    return items

@router.post("/")
async def create_or_update_services(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = ServiceCategory(**data)
    await db.merge(new_item)
    await db.commit()
    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_services(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(ServiceCategory))
        for data in data_list:
            item = ServiceCategory(**data)
            db.add(item)
        await db.commit()
        return {"message": "Services synchronized"}
    except Exception as e:
        await db.rollback()
        raise e

