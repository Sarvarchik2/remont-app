from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from app.core.database import get_db
from app.features.projects.models import Project

router = APIRouter()

@router.get("/")
async def get_all_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project))
    items = result.scalars().all()
    return items

@router.post("/")
async def create_or_update_projects(data: dict, db: AsyncSession = Depends(get_db)):
    new_item = Project(**data)
    await db.merge(new_item)
    await db.commit()
    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_projects(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(Project))
        for data in data_list:
            item = Project(**data)
            db.add(item)
        await db.commit()
        return {"message": "Projects synchronized"}
    except Exception as e:
        await db.rollback()
        raise e

