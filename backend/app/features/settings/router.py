from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.features.settings.models import CalculatorSetting

router = APIRouter()

@router.get("/")
async def get_all_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CalculatorSetting))
    items = result.scalars().all()
    # Pydantic is cleaner but returning dict simplifies our quick setup
    return items

@router.post("/")
async def create_or_update_settings(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = CalculatorSetting(**data)
    await db.merge(new_item)
    await db.commit()
    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_settings(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    for data in data_list:
        item = CalculatorSetting(**data)
        await db.merge(item)
    await db.commit()
    return {"message": "Batch upserted"}

