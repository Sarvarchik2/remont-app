from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.features.leads.models import Lead
from app.features.bot.bot import notify_admin

router = APIRouter()

@router.get("/")
async def get_all_leads(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead))
    items = result.scalars().all()
    # Pydantic is cleaner but returning dict simplifies our quick setup
    return items

@router.post("/")
async def create_or_update_leads(data: dict, db: AsyncSession = Depends(get_db)):
    # Check if this lead exists to avoid notifying on updates
    existing_lead = await db.get(Lead, data.get('id'))
    is_new = existing_lead is None
    
    new_item = Lead(**data)
    await db.merge(new_item)
    await db.commit()
    
    if is_new:
        try:
            source_labels = {
                'calculator': '📊 Расчет стоимости',
                'booking': '📅 Запись на замер',
                'catalog': '🛒 Заказ из каталога',
                'phone': '📞 Телефон',
                'other': '❓ Другое'
            }
            source_label = source_labels.get(data.get('source'), '❓ Неизвестный источник')
            
            # Extract name correctly
            client_name = data.get('name')
            if isinstance(client_name, dict):
                client_name = client_name.get('ru') or client_name.get('uz')
            
            phone = data.get('phone', 'Не указан')
            
            msg = (
                f"🔔 <b>НОВАЯ ЗАЯВКА - Vicasa</b>\n\n"
                f"📍 <b>Источник:</b> {source_label}\n"
                f"👤 <b>Клиент:</b> {client_name or 'Не указан'}\n"
                f"📱 <b>Телефон:</b> {phone}\n"
                f"🕒 <b>Дата:</b> {data.get('date', 'Сегодня')} {data.get('time', '')}\n"
            )
            
            if data.get('calculatorData'):
                calc = data['calculatorData']
                cost = calc.get('estimatedCost', 0)
                msg += f"\n💰 <b>Предварительный расчет:</b> {cost:,} сум\n"
                msg += f"📐 <b>Площадь:</b> {calc.get('area')} м²"
            
            if data.get('notes'):
                msg += f"\n\n📝 <b>Заметка:</b> {data['notes']}"
                
            await notify_admin(msg)
        except Exception as e:
            print(f"Failed to notify admin: {e}")

    return {"message": "Saved successfully"}

@router.post("/batch")
async def create_batch_leads(data_list: list[dict], db: AsyncSession = Depends(get_db)):
    for data in data_list:
        item = Lead(**data)
        await db.merge(item)
    await db.commit()
    return {"message": "Batch upserted"}

