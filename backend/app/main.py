from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base

import app.features.users.models
import app.features.leads.models
import app.features.projects.models
import app.features.portfolio.models
import app.features.catalog.models
import app.features.services.models
import app.features.stories.models
import app.features.settings.models

from app.features.users.router import router as users_router
from app.features.leads.router import router as leads_router
from app.features.projects.router import router as projects_router
from app.features.portfolio.router import router as portfolio_router
from app.features.catalog.router import router as catalog_router
from app.features.services.router import router as services_router
from app.features.stories.router import router as stories_router
from app.features.settings.router import router as settings_router
from app.features.media_router import router as media_router
from fastapi.staticfiles import StaticFiles
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Ensure static directory exists
    os.makedirs("static/uploads", exist_ok=True)
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
app.include_router(leads_router, prefix="/api/v1/leads", tags=["leads"])
app.include_router(projects_router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(portfolio_router, prefix="/api/v1/portfolio", tags=["portfolio"])
app.include_router(catalog_router, prefix="/api/v1/catalog", tags=["catalog"])
app.include_router(services_router, prefix="/api/v1/services", tags=["services"])
app.include_router(stories_router, prefix="/api/v1/stories", tags=["stories"])
app.include_router(settings_router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(media_router, prefix="/api/v1/media", tags=["media"])

@app.get("/")
async def root():
    return {"message": "Telegram Web App API is running!"}
