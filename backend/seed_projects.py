import urllib.request
import json

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

projects_data = [
    {
        "id": "proj-101",
        "clientName": {"ru": "Александр Иванов", "en": "Alexander Ivanov", "uz": "Aleksandr Ivanov"},
        "address": {"ru": "ЖК 'Новомосковская', кв. 42", "en": "RC 'Novomoskovskaya', apt 42", "uz": "TK 'Novomoskovskaya', kv. 42"},
        "phone": "+998901234567",
        "totalEstimate": 15000.0,
        "startDate": "2024-03-01T09:00:00Z",
        "deadline": "2024-05-15T18:00:00Z",
        "status": "process",
        "currentStage": {"ru": "Укладка плитки", "en": "Tiling", "uz": "Kafel yotqizish"},
        "contractNumber": "DOC-2024-001",
        "telegramId": "demo-tg-id",
        "finance": {
            "total": 15000.0,
            "paid": 5000.0,
            "remaining": 10000.0
        },
        "payments": [
            {
                "id": "pay-1",
                "date": "2024-03-01",
                "amount": 3000.0,
                "comment": "Аванс за стройматериалы",
                "description": {"ru": "Аванс за стройматериалы", "en": "Advance for materials", "uz": "Materiallar uchun avans"}
            },
            {
                "id": "pay-2",
                "date": "2024-03-15",
                "amount": 2000.0,
                "comment": "Оплата за демонтаж",
                "description": {"ru": "Оплата за демонтаж", "en": "Payment for demolition", "uz": "Buzilish ishlari uchun to'lov"}
            }
        ],
        "timeline": [
            {
                "id": "evt-1",
                "date": "2024-03-01",
                "title": {"ru": "Начало работ", "en": "Start of works", "uz": "Ishni boshlash"},
                "description": {"ru": "Завезли инструмент и начали демонтаж", "en": "Tools arrived, starting demolition", "uz": "Asboblar keltirildi, buzishni boshladik"},
                "type": "text",
                "status": "completed"
            },
            {
                "id": "evt-2",
                "date": "2024-03-10",
                "title": {"ru": "Демонтаж завершен", "en": "Demolition completed", "uz": "Buzish ishlari tugatildi"},
                "description": {"ru": "Снесли старые перегородки", "en": "Torn down old walls", "uz": "Eski devorlar buzildi"},
                "type": "photo",
                "mediaUrls": ["/static/uploads/living_room_before_1772304534075.png"],
                "status": "completed"
            },
            {
                "id": "evt-3",
                "date": "2024-03-25",
                "title": {"ru": "Укладка плитки", "en": "Tiling", "uz": "Kafel yotqizish"},
                "description": {"ru": "Начали укладку плитки в ванной", "en": "Started tiling in the bathroom", "uz": "Hammomda kafel yotqizishni boshladik"},
                "type": "photo",
                "mediaUrls": ["/static/uploads/work_process_1772304509411.png"],
                "status": "in_progress"
            }
        ]
    }
]

print("Seeding Projects...")
post_batch("projects", projects_data)
print("Projects added!")
