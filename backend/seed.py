import urllib.request
import json
import ssl

BASE_URL = "http://localhost:8000/api/v1"

def post_batch(endpoint, data):
    url = f"{BASE_URL}/{endpoint}/batch"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Content-Type', 'application/json')
    jsondata = json.dumps(data)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    
    try:
        response = urllib.request.urlopen(req, jsondataasbytes)
        print(f"[{endpoint}] Success: {response.read().decode('utf-8')}")
    except Exception as e:
        print(f"[{endpoint}] Error: {getattr(e, 'read', lambda: str(e))()}")

portfolio_data = [
    {
        "type": "living",
        "title": {
            "ru": "Гостиная в стиле минимализм",
            "en": "Minimalist living room",
            "uz": "Minimalist uslubidagi mehmonxona"
        },
        "imgBefore": "/static/uploads/living_room_before_1772304534075.png",
        "imgAfter": "/static/uploads/living_room_after_1772304473051.png",
        "area": "25 м²",
        "term": "45 дней",
        "cost": "$4,500",
        "location": "Ташкент, Мирзо-Улугбекский р-н",
        "isNewBuilding": True,
        "description": {
            "ru": "Полный капитальный ремонт гостиной с заменой полов, выравниванием стен и установкой современной мебели.",
            "en": "Major living room overhaul including floor replacement, wall leveling, and modern furniture setup.",
            "uz": "Qavatni almashtirish, devorlarni tekislash va zamonaviy mebel o'rnatish kabi asosiy yashash xonasi tamiri."
        },
        "worksCompleted": [
            {
                "category": "Черновые работы",
                "items": ["Демонтаж обоев и пола", "Штукатурка стен по маякам"]
            },
            {
                "category": "Чистовая отделка",
                "items": ["Укладка ламината", "Покраска стен", "Установка плинтусов"]
            }
        ]
    },
    {
        "type": "bath",
        "title": {
            "ru": "Ванная комната 'Modern Slate'",
            "en": "'Modern Slate' Bathroom",
            "uz": "'Modern Slate' Hammom"
        },
        "imgBefore": "/static/uploads/bathroom_before_1772304546545.png",
        "imgAfter": "/static/uploads/bathroom_after_1772304485841.png",
        "area": "8 м²",
        "term": "20 дней",
        "cost": "$2,800",
        "location": "Ташкент, Яккасарайский р-н",
        "isNewBuilding": False,
        "description": {
            "ru": "Полная реконструкция ванной. Установлена современная отдельностоящая ванна, темная матовая плитка с теплой подсветкой.",
            "en": "Full bathroom renovation. Installed modern freestanding bathtub, dark matte tiles with warm LED lighting.",
            "uz": "Hammomni to'liq ta'mirlash. Zamonaviy mustaqil vanna, qora matli plitkalar issiq LED yoritgichi bilan o'rnatildi."
        }
    },
    {
        "type": "kitchen",
        "title": {
            "ru": "Ультрасовременная кухня с островом",
            "en": "Ultramodern Kitchen with Island",
            "uz": "Orol bilan juda zamonaviy oshxona"
        },
        "imgBefore": "/static/uploads/living_room_before_1772304534075.png",
        "imgAfter": "/static/uploads/kitchen_after_1772304498639.png",
        "area": "18 м²",
        "term": "35 дней",
        "cost": "$5,200",
        "location": "Ташкент, Юнусабадский р-н",
        "isNewBuilding": True,
        "description": {
            "ru": "Современная кухня с белой мраморной столешницей, матовыми фасадами и стильным освещением.",
            "en": "Modern kitchen with white marble countertop, matte facades and stylish lighting.",
            "uz": "Oq marmar stol usti, mat jabhalari va zamonaviy yoritgichli zamonaviy oshxona."
        }
    }
]

catalog_data = [
    {
        "id": "sofa-001",
        "category": "furniture",
        "title": {
            "ru": "Диван 'Сканди'",
            "en": "Sofa 'Scandi'",
            "uz": "Divan 'Scandi'"
        },
        "description": {
            "ru": "Современный минималистичный серый диван с тканевой обивкой. Идеально подходит для любой гостиной.",
            "en": "Modern minimalist grey sofa with fabric upholstery. Perfect fit for any living room.",
            "uz": "Matoli qoplamali zamonaviy minimalist kulrang divan. Har qanday yashash xonasi uchun juda mos keladi."
        },
        "price": 850,
        "image": "/static/uploads/catalog_sofa_1772304560325.png",
        "images": ["/static/uploads/catalog_sofa_1772304560325.png"]
    },
    {
        "id": "floor-001",
        "category": "materials",
        "title": {
            "ru": "Ламинат 'Дуб Натуральный'",
            "en": "Laminate 'Natural Oak'",
            "uz": "Laminat 'Natural eman'"
        },
        "description": {
            "ru": "Высококачественный ламинат 33 класса с текстурой натурального дуба.",
            "en": "High quality class 33 laminate floor with natural oak texture.",
            "uz": "Tabiiy eman tuzilishi bilan yuqori sifatli 33 sinf laminat poly."
        },
        "price": 25,
        "image": "/static/uploads/catalog_laminate_1772304576586.png",
        "images": ["/static/uploads/catalog_laminate_1772304576586.png"]
    }
]

stories_data = [
    {
        "id": "story-process-1",
        "category": "process",
        "imageUrl": "/static/uploads/work_process_1772304509411.png",
        "title": {
            "ru": "Как мы укладываем плитку",
            "en": "How we lay tiles",
            "uz": "Biz qanday qilib plitka yotqizamiz"
        }
    },
    {
        "id": "story-reviews-1",
        "category": "reviews",
        "imageUrl": "/static/uploads/bathroom_after_1772304485841.png",
        "title": {
            "ru": "Отзыв клиента: Идеальная ванная",
            "en": "Client Review: Perfect Bathroom",
            "uz": "Mijoz sharhi: Mukammal hammom"
        }
    }
]

services_data = [
    {
        "id": "finishing-works",
        "title": {"ru": "Чистовая отделка", "en": "Finishing works", "uz": "Tugatish ishlari"},
        "icon": "Brush",
        "services": [
            {
                "id": "paint-walls",
                "name": {"ru": "Покраска стен", "en": "Wall painting", "uz": "Devorlarni bo'yash"},
                "price": "4$",
                "unit": {"ru": "м²", "en": "sq.m", "uz": "k.m"}
            },
            {
                "id": "laminate-floor",
                "name": {"ru": "Укладка ламината", "en": "Laying laminate", "uz": "Laminat yotqizish"},
                "price": "5$",
                "unit": {"ru": "м²", "en": "sq.m", "uz": "k.m"}
            }
        ]
    }
]

print("Seeding Portfolio...")
post_batch("portfolio", portfolio_data)

print("Seeding Catalog...")
post_batch("catalog", catalog_data)

print("Seeding Stories...")
post_batch("stories", stories_data)

print("Seeding Services...")
# Services batch needs adjusting if we post ServiceCategory vs Services
# Let's verify format. Usually batch receives what model expected.
# Note: we might need to modify schema/routers if it doesn't match perfectly.
# Using /batch on /services might expect ServiceCategory model.
post_batch("services", services_data)

print("Done!")
