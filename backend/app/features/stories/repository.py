from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.features.stories.models import *

class StoriesRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
        
    # Add generic CRUD methods here later depending on model
