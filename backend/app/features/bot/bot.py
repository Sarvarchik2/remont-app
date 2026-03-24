import logging
import asyncio
from aiogram import Bot, Dispatcher, types, F, Router
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder, InlineKeyboardBuilder
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.features.users.models import User
from sqlalchemy import select, update

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

# Change if your group ID is different, the one provided was -5283833189
ADMIN_GROUP_ID = -5283833189

async def notify_admin(message_text: str):
    try:
        await bot.send_message(chat_id=ADMIN_GROUP_ID, text=message_text, parse_mode="HTML")
    except Exception as e:
        logger.error(f"Error sending admin notification: {e}")

# Translations
MESSAGES = {
    "ru": {
        "welcome": "👋 <b>Приветствуем вас в Velaro!</b>\n\nМы — ваш персональный помощник в мире идеального ремонта. Наша платформа поможет вам рассчитать стоимость, выбрать материалы и найти лучших мастеров.\n\nПожалуйста, выберите язык:",
        "choose_lang": "Пожалуйста, выберите язык интерфейса:",
        "request_contact": "✨ <b>Отлично!</b>\n\nЧтобы мы могли сохранить ваши расчеты и связаться с вами, пожалуйста, поделитесь своим контактом, нажав кнопку ниже 👇",
        "btn_contact": "📱 Поделиться контактом",
        "thanks": "✅ <b>Спасибо!</b>\n\nВаш профиль настроен. Теперь вы можете пользоваться всеми функциями Velaro.",
        "btn_open": "🚀 Открыть Velaro",
    },
    "uz": {
        "welcome": "👋 <b>Velaro-ga xush kelibsiz!</b>\n\nBiz — mukammal ta'mirlash dunyosidagi sizning shaxsiy yordamchingiz miz. Bizning platformamiz narxni hisoblash, materiallarni tanlash va eng yaxshi ustalarni topishda yordam beradi.\n\nIltimos, tilni tanlang:",
        "choose_lang": "Iltimos, interfeys tilini tanlang:",
        "request_contact": "✨ <b>Ajoyib!</b>\n\nHisob-kitoblaringizni saqlash va siz bilan bog'lanishimiz uchun, iltimos, pastdagi tugmani bosish orqali kontaktingiz bilan bo'lishing 👇",
        "btn_contact": "📱 Kontaktingizni yuboring",
        "thanks": "✅ <b>Rahmat!</b>\n\nProfilingiz sozlandi. Endi Velaro-ning barcha funksiyalaridan foydalanishingiz mumkin.",
        "btn_open": "🚀 Velaro-ni ochish",
    }
}

async def get_user(telegram_id: str):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        return result.scalars().first()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    user = await get_user(str(message.from_user.id))
    
    # Language selection keyboard
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="🇷🇺 Русский", callback_data="lang_ru"),
        InlineKeyboardButton(text="🇺🇿 O'zbekcha", callback_data="lang_uz")
    )
    
    welcome_text = MESSAGES["ru"]["welcome"] # Default welcome
    await message.answer(welcome_text, reply_markup=builder.as_markup(), parse_mode="HTML")

@dp.callback_query(F.data.startswith("lang_"))
async def process_language(callback: types.CallbackQuery):
    lang = callback.data.split("_")[1]
    telegram_id = str(callback.from_user.id)
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        user = result.scalars().first()
        
        if user:
            user.language = lang
        else:
            user = User(
                telegram_id=telegram_id,
                username=callback.from_user.username,
                first_name=callback.from_user.first_name,
                last_name=callback.from_user.last_name,
                language=lang
            )
            session.add(user)
        await session.commit()
    
    if not user.phone:
        kb = [[KeyboardButton(text=MESSAGES[lang]["btn_contact"], request_contact=True)]]
        keyboard = ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True, one_time_keyboard=True)
        await callback.message.answer(MESSAGES[lang]["request_contact"], reply_markup=keyboard, parse_mode="HTML")
    else:
        await callback.message.answer(MESSAGES[lang]["thanks"], reply_markup=types.ReplyKeyboardRemove(), parse_mode="HTML")
    
    await callback.answer()

@dp.message(F.contact)
async def handle_contact(message: types.Message):
    contact = message.contact
    telegram_id = str(message.from_user.id)
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.telegram_id == telegram_id))
        user = result.scalars().first()
        lang = user.language if user and user.language else "ru"
        
        if user:
            user.phone = contact.phone_number
            user.first_name = message.from_user.first_name
            user.last_name = message.from_user.last_name
        else:
            user = User(
                telegram_id=telegram_id,
                username=message.from_user.username,
                first_name=message.from_user.first_name,
                last_name=message.from_user.last_name,
                phone=contact.phone_number,
                language="ru"
            )
            session.add(user)
        await session.commit()
    
    # Notify Admin Group
    user_display = f"@{message.from_user.username}" if message.from_user.username else f"ID: {telegram_id}"
    full_name = f"{message.from_user.first_name} {message.from_user.last_name or ''}".strip()
    admin_text = (
        f"👤 <b>Новый пользователь зашел в Velaro!</b>\n\n"
        f"🏷 Имя: {full_name}\n"
        f"📱 Телефон: {contact.phone_number}\n"
        f"🔗 Профиль: <a href='tg://user?id={telegram_id}'>{user_display}</a>"
    )
    await notify_admin(admin_text)
    
    await message.answer(MESSAGES[lang]["thanks"], reply_markup=types.ReplyKeyboardRemove(), parse_mode="HTML")

async def start_bot():
    logger.info("Starting Telegram Bot with Multi-language support...")
    try:
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot)
    except Exception as e:
        logger.error(f"Bot error: {e}")
