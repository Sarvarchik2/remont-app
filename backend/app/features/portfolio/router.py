from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from app.core.database import get_db
from app.features.portfolio.models import PortfolioItem

router = APIRouter()

@router.get("/")
async def get_all_portfolio(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PortfolioItem))
    items = result.scalars().all()
    return items

@router.post("/")
async def create_or_update_portfolio(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = PortfolioItem(**data)
    await db.merge(new_item)
    await db.commit()
    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_portfolio(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(PortfolioItem))
        for data in data_list:
            item = PortfolioItem(**data)
            db.add(item)
        await db.commit()
        return {"message": "Portfolio synchronized"}
    except Exception as e:
        await db.rollback()
        raise e

