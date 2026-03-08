import asyncio
import sys
import os

# Add the parent directory to sys.path to allow importing from 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.features.services.models import ServiceCategory
from app.features.portfolio.models import PortfolioItem
from app.features.settings.models import CalculatorSetting
from app.features.stories.models import Story
from app.features.catalog.models import CatalogItem
from sqlalchemy import select

async def seed_data():
    async with AsyncSessionLocal() as session:
        print("Checking if seeding is needed...")
        
        # 1. Services
        result = await session.execute(select(ServiceCategory))
        if not result.scalars().first():
            service = ServiceCategory(
                id="renovation-turnkey",
                title={"ru": "Ремонт под ключ", "uz": "Kalit ostida ta'mirlash"},
                icon="Home",
                services=[
                    {
                        "id": "economy",
                        "title": {"ru": "Эконом", "uz": "Ekonom"},
                        "description": {"ru": "Базовый ремонт для сдачи в аренду", "uz": "Ijaraga berish uchun asosiy ta'mirlash"},
                        "price": 1200000,
                        "unit": "м²"
                    },
                    {
                        "id": "standard",
                        "title": {"ru": "Стандарт", "uz": "Standart"},
                        "description": {"ru": "Качественный ремонт для комфортной жизни", "uz": "Qulay hayot uchun sifatli ta'mirlash"},
                        "price": 2500000,
                        "unit": "м²"
                    },
                    {
                        "id": "premium",
                        "title": {"ru": "Премиум", "uz": "Premium"},
                        "description": {"ru": "Дизайнерский ремонт премиум-класса", "uz": "Premium toifadagi dizaynerlik ta'mirlash ishlari"},
                        "price": 4500000,
                        "unit": "м²"
                    }
                ]
            )
            session.add(service)
            print("Added ServiceCategory")

        # 2. Portfolio
        result = await session.execute(select(PortfolioItem))
        if not result.scalars().first():
            portfolio = PortfolioItem(
                type="living",
                title={"ru": "Современная гостиная в ЖК 'Nest One'", "uz": "'Nest One' turar-joy majmuasidagi zamonaviy mehmonxona"},
                imgBefore="https://images.unsplash.com/photo-1581853113523-28827725838d?w=800&q=80",
                imgAfter="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
                area="45 м²",
                term="1.5 месяца",
                cost="45,000,000 сум",
                location="Ташкент, Сити",
                isNewBuilding=True,
                tags=["loft", "minimalism", "modern"],
                description={"ru": "Полный ремонт гостиной в стиле лофт с использованием премиальных материалов.", "uz": "Premium materiallardan foydalangan holda loft uslubidagi mehmonxonani to'liq ta'mirlash."},
                worksCompleted=[
                    {"ru": "Демонтаж перегородок", "uz": "To'siqlarni demontaj qilish"},
                    {"ru": "Разводка электрики", "uz": "Elektr simlarini yotqizish"},
                    {"ru": "Штукатурка стен", "uz": "Devorlarni suvoq qilish"},
                    {"ru": "Укладка ламината", "uz": "Laminat yotqizish"}
                ],
                budget="50,000,000 сум",
                duration="45 дней",
                team=[
                    {"name": "Алишер", "role": "Прораб"},
                    {"name": "Сергей", "role": "Электрик"}
                ],
                gallery=[
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
                    "https://images.unsplash.com/photo-1600607687940-c52af096999c?w=800&q=80"
                ]
            )
            session.add(portfolio)
            print("Added PortfolioItem")

        # 3. Calculator Settings
        result = await session.execute(select(CalculatorSetting))
        if not result.scalars().first():
            calc_settings = CalculatorSetting(
                prices={
                    "new": {
                        "economy": 1200000,
                        "standard": 2500000,
                        "premium": 4500000
                    },
                    "secondary": {
                        "economy": 1500000,
                        "standard": 2800000,
                        "premium": 4800000
                    }
                }
            )
            session.add(calc_settings)
            print("Added CalculatorSetting")

        # 4. Stories
        result = await session.execute(select(Story))
        if not result.scalars().first():
            story = Story(
                id="process-1",
                category="process",
                imageUrl="https://images.unsplash.com/photo-1503387762-592dee58c460?w=800&q=80",
                title={"ru": "Наш процесс работы", "uz": "Bizning ish jarayonimiz"}
            )
            session.add(story)
            print("Added Story")

        # 5. Catalog Item (Furniture/Materials)
        result = await session.execute(select(CatalogItem))
        if not result.scalars().first():
            catalog_item = CatalogItem(
                id="laminate-premium",
                category="materials",
                title={"ru": "Ламинат Classen", "uz": "Classen Laminati"},
                description={"ru": "Дуб светлый, 33 класс, 8мм", "uz": "Ochiq dub, 33-klass, 8mm"},
                price=150000.0,
                image="https://images.unsplash.com/photo-1581853113523-28827725838d?w=800&q=80",
                images=["https://images.unsplash.com/photo-1581853113523-28827725838d?w=800&q=80"],
                specs=[
                    {"label": {"ru": "Класс", "uz": "Klass"}, "value": {"ru": "33", "uz": "33"}},
                    {"label": {"ru": "Толщина", "uz": "Qalinligi"}, "value": {"ru": "8мм", "uz": "8mm"}}
                ]
            )
            session.add(catalog_item)
            print("Added CatalogItem")

        await session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())

