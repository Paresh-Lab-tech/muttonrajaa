"from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'rajaa@2025')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'mr-admin-secret-token-2025')

app = FastAPI(title=\"Mutton Rajaa API\")
api_router = APIRouter(prefix=\"/api\")


# ============ Models ============
class MenuItem(BaseModel):
    model_config = ConfigDict(extra=\"ignore\")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str  # \"mutton\", \"seafood\", \"traditional\", \"sides\", \"beverages\"
    image_url: Optional[str] = None
    is_signature: bool = False
    is_available: bool = True
    spice_level: int = 2  # 1-3
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_signature: bool = False
    is_available: bool = True
    spice_level: int = 2


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_signature: Optional[bool] = None
    is_available: Optional[bool] = None
    spice_level: Optional[int] = None


class Reservation(BaseModel):
    model_config = ConfigDict(extra=\"ignore\")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    party_size: int
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    notes: Optional[str] = None
    status: str = \"pending\"  # pending, confirmed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReservationCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    party_size: int
    date: str
    time: str
    notes: Optional[str] = None


class OrderItem(BaseModel):
    item_id: str
    name: str
    price: float
    quantity: int


class Order(BaseModel):
    model_config = ConfigDict(extra=\"ignore\")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    phone: str
    address: str
    items: List[OrderItem]
    subtotal: float
    tax: float
    total: float
    notes: Optional[str] = None
    order_type: str = \"delivery\"  # delivery, pickup
    status: str = \"received\"  # received, preparing, ready, delivered, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    items: List[OrderItem]
    notes: Optional[str] = None
    order_type: str = \"delivery\"


class AdminLogin(BaseModel):
    password: str


class StatusUpdate(BaseModel):
    status: str


# ============ Auth ============
def verify_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith(\"Bearer \"):
        raise HTTPException(status_code=401, detail=\"Missing or invalid auth header\")
    token = authorization.split(\" \", 1)[1]
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail=\"Invalid token\")
    return True


# ============ Routes ============
@api_router.get(\"/\")
async def root():
    return {\"message\": \"Mutton Rajaa API\", \"version\": \"1.0\"}


@api_router.post(\"/admin/login\")
async def admin_login(payload: AdminLogin):
    if payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail=\"Invalid password\")
    return {\"token\": ADMIN_TOKEN}


# ----- Menu (public) -----
@api_router.get(\"/menu\", response_model=List[MenuItem])
async def get_menu(category: Optional[str] = None):
    query = {}
    if category:
        query[\"category\"] = category
    items = await db.menu_items.find(query, {\"_id\": 0}).to_list(500)
    for it in items:
        if isinstance(it.get(\"created_at\"), str):
            it[\"created_at\"] = datetime.fromisoformat(it[\"created_at\"])
    return items


@api_router.get(\"/menu/{item_id}\", response_model=MenuItem)
async def get_menu_item(item_id: str):
    item = await db.menu_items.find_one({\"id\": item_id}, {\"_id\": 0})
    if not item:
        raise HTTPException(status_code=404, detail=\"Not found\")
    if isinstance(item.get(\"created_at\"), str):
        item[\"created_at\"] = datetime.fromisoformat(item[\"created_at\"])
    return item


# ----- Menu (admin) -----
@api_router.post(\"/admin/menu\", response_model=MenuItem)
async def create_menu_item(payload: MenuItemCreate, _: bool = Depends(verify_admin)):
    item = MenuItem(**payload.model_dump())
    doc = item.model_dump()
    doc[\"created_at\"] = doc[\"created_at\"].isoformat()
    await db.menu_items.insert_one(doc)
    return item


@api_router.put(\"/admin/menu/{item_id}\", response_model=MenuItem)
async def update_menu_item(item_id: str, payload: MenuItemUpdate, _: bool = Depends(verify_admin)):
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail=\"No fields to update\")
    result = await db.menu_items.update_one({\"id\": item_id}, {\"$set\": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=\"Not found\")
    item = await db.menu_items.find_one({\"id\": item_id}, {\"_id\": 0})
    if isinstance(item.get(\"created_at\"), str):
        item[\"created_at\"] = datetime.fromisoformat(item[\"created_at\"])
    return item


@api_router.delete(\"/admin/menu/{item_id}\")
async def delete_menu_item(item_id: str, _: bool = Depends(verify_admin)):
    result = await db.menu_items.delete_one({\"id\": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=\"Not found\")
    return {\"deleted\": True}


# ----- Reservations -----
@api_router.post(\"/reservations\", response_model=Reservation)
async def create_reservation(payload: ReservationCreate):
    res = Reservation(**payload.model_dump())
    doc = res.model_dump()
    doc[\"created_at\"] = doc[\"created_at\"].isoformat()
    await db.reservations.insert_one(doc)
    return res


@api_router.get(\"/admin/reservations\", response_model=List[Reservation])
async def list_reservations(_: bool = Depends(verify_admin)):
    items = await db.reservations.find({}, {\"_id\": 0}).sort(\"created_at\", -1).to_list(1000)
    for it in items:
        if isinstance(it.get(\"created_at\"), str):
            it[\"created_at\"] = datetime.fromisoformat(it[\"created_at\"])
    return items


@api_router.put(\"/admin/reservations/{res_id}\", response_model=Reservation)
async def update_reservation_status(res_id: str, payload: StatusUpdate, _: bool = Depends(verify_admin)):
    result = await db.reservations.update_one({\"id\": res_id}, {\"$set\": {\"status\": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=\"Not found\")
    item = await db.reservations.find_one({\"id\": res_id}, {\"_id\": 0})
    if isinstance(item.get(\"created_at\"), str):
        item[\"created_at\"] = datetime.fromisoformat(item[\"created_at\"])
    return item


# ----- Orders -----
@api_router.post(\"/orders\", response_model=Order)
async def create_order(payload: OrderCreate):
    subtotal = sum(it.price * it.quantity for it in payload.items)
    tax = round(subtotal * 0.05, 2)
    total = round(subtotal + tax, 2)
    order = Order(
        **payload.model_dump(),
        subtotal=round(subtotal, 2),
        tax=tax,
        total=total,
    )
    doc = order.model_dump()
    doc[\"created_at\"] = doc[\"created_at\"].isoformat()
    await db.orders.insert_one(doc)
    return order


@api_router.get(\"/admin/orders\", response_model=List[Order])
async def list_orders(_: bool = Depends(verify_admin)):
    items = await db.orders.find({}, {\"_id\": 0}).sort(\"created_at\", -1).to_list(1000)
    for it in items:
        if isinstance(it.get(\"created_at\"), str):
            it[\"created_at\"] = datetime.fromisoformat(it[\"created_at\"])
    return items


@api_router.put(\"/admin/orders/{order_id}\", response_model=Order)
async def update_order_status(order_id: str, payload: StatusUpdate, _: bool = Depends(verify_admin)):
    result = await db.orders.update_one({\"id\": order_id}, {\"$set\": {\"status\": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=\"Not found\")
    item = await db.orders.find_one({\"id\": order_id}, {\"_id\": 0})
    if isinstance(item.get(\"created_at\"), str):
        item[\"created_at\"] = datetime.fromisoformat(item[\"created_at\"])
    return item


# ============ Seed ============
SEED_MENU = [
    {
        \"name\": \"Mutton Kasa\",
        \"description\": \"Slow-cooked mutton in a thick, fiery onion-tomato masala — the legendary signature of Mutton Rajaa, prepared the authentic Odia way.\",
        \"price\": 380.0,
        \"category\": \"mutton\",
        \"image_url\": \"https://images.unsplash.com/photo-1710091692253-a31df7ba2a6d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"is_signature\": True,
        \"spice_level\": 3,
    },
    {
        \"name\": \"Similipal Mutton\",
        \"description\": \"Forest-style mutton inspired by the tribal kitchens of Similipal — smoky, herbaceous, and earthy.\",
        \"price\": 420.0,
        \"category\": \"mutton\",
        \"image_url\": \"https://images.unsplash.com/photo-1545247181-516773cae754?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"is_signature\": True,
        \"spice_level\": 3,
    },
    {
        \"name\": \"Mutton Curry\",
        \"description\": \"Home-style mutton curry simmered with whole spices, ginger and slow-pounded garlic. Comforting, never overpowering.\",
        \"price\": 340.0,
        \"category\": \"mutton\",
        \"image_url\": \"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 2,
    },
    {
        \"name\": \"Mutton Handi\",
        \"description\": \"Mutton braised in a sealed clay handi until it falls off the bone — finished with fresh coriander and ghee.\",
        \"price\": 400.0,
        \"category\": \"mutton\",
        \"image_url\": \"https://images.unsplash.com/photo-1574484184081-afea8a62f9c0?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 2,
    },
    {
        \"name\": \"Kalija Kasa\",
        \"description\": \"Tender mutton liver tossed with mustard oil, kashmiri chilli and fried onions. A bold, iron-rich classic.\",
        \"price\": 320.0,
        \"category\": \"mutton\",
        \"image_url\": \"https://images.unsplash.com/photo-1633237308525-cd587cf71926?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 3,
    },
    {
        \"name\": \"Mutton Bhaja\",
        \"description\": \"Crisp pan-fried mutton chunks marinated overnight in raw turmeric, garlic and panchphutana.\",
        \"price\": 360.0,
        \"category\": \"mutton\",
        \"image_url\": \"https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 2,
    },
    {
        \"name\": \"Chingudi Cheha\",
        \"description\": \"Coastal Odia prawn curry with mustard, coconut and curry leaves. Light, fragrant and unmistakably Odia.\",
        \"price\": 360.0,
        \"category\": \"seafood\",
        \"image_url\": \"https://images.unsplash.com/photo-1559847844-5315695dadae?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"is_signature\": True,
        \"spice_level\": 2,
    },
    {
        \"name\": \"Chilika Crab Masala\",
        \"description\": \"Crab from the Chilika lagoon, slow cooked in a roasted spice masala — sweet, briny and deeply savoury.\",
        \"price\": 520.0,
        \"category\": \"seafood\",
        \"image_url\": \"https://images.unsplash.com/photo-1653403020036-22f7e6922912?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"is_signature\": True,
        \"spice_level\": 3,
    },
    {
        \"name\": \"Macha Besara\",
        \"description\": \"Rohu fish in a sharp pungent mustard-garlic gravy — Odisha on a plate.\",
        \"price\": 280.0,
        \"category\": \"seafood\",
        \"image_url\": \"https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 2,
    },
    {
        \"name\": \"Pakhala Bhata\",
        \"description\": \"Fermented rice in cool water tempered with curry leaves — served with badi chura, fried fish and aloo bharta.\",
        \"price\": 180.0,
        \"category\": \"traditional\",
        \"image_url\": \"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"is_signature\": True,
        \"spice_level\": 1,
    },
    {
        \"name\": \"Dalma\",
        \"description\": \"Toor dal slow simmered with raw papaya, pumpkin and roasted cumin — vegetarian comfort.\",
        \"price\": 160.0,
        \"category\": \"traditional\",
        \"image_url\": \"https://images.unsplash.com/photo-1546833999-b9f581a1996d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Chattu Fry\",
        \"description\": \"Wild mushroom stir-fry tempered with garlic, ginger and slit green chilli.\",
        \"price\": 220.0,
        \"category\": \"traditional\",
        \"image_url\": \"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 2,
    },
    {
        \"name\": \"Santula\",
        \"description\": \"A medley of seasonal vegetables steamed and finished with a panchphutana tempering.\",
        \"price\": 150.0,
        \"category\": \"traditional\",
        \"image_url\": \"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Steamed Basmati Rice\",
        \"description\": \"Long-grain basmati, simply steamed — the perfect canvas.\",
        \"price\": 90.0,
        \"category\": \"sides\",
        \"image_url\": \"https://images.unsplash.com/photo-1516684732162-798a0062be99?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Garlic Naan\",
        \"description\": \"Tandoor-fired naan brushed with cultured butter and crushed garlic.\",
        \"price\": 70.0,
        \"category\": \"sides\",
        \"image_url\": \"https://images.unsplash.com/photo-1626074353765-517a681e40be?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Roti\",
        \"description\": \"Wholewheat tandoor flatbread, soft and pliable.\",
        \"price\": 25.0,
        \"category\": \"sides\",
        \"image_url\": \"https://images.unsplash.com/photo-1565557623262-b51c2513a641?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Masala Lassi\",
        \"description\": \"Hand-churned yogurt with cumin, mint and a pinch of black salt.\",
        \"price\": 90.0,
        \"category\": \"beverages\",
        \"image_url\": \"https://images.unsplash.com/photo-1599643477877-530eb83abc8e?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Bel Pana\",
        \"description\": \"Cooling wood-apple sherbet with jaggery, black pepper and roasted cumin.\",
        \"price\": 80.0,
        \"category\": \"beverages\",
        \"image_url\": \"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
    {
        \"name\": \"Filter Coffee\",
        \"description\": \"Strong south-Indian decoction served with frothed milk in a steel tumbler.\",
        \"price\": 60.0,
        \"category\": \"beverages\",
        \"image_url\": \"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&q=85&w=800\",
        \"spice_level\": 1,
    },
]


@app.on_event(\"startup\")
async def seed_data():
    count = await db.menu_items.count_documents({})
    if count == 0:
        items = []
        for entry in SEED_MENU:
            item = MenuItem(**entry)
            doc = item.model_dump()
            doc[\"created_at\"] = doc[\"created_at\"].isoformat()
            items.append(doc)
        if items:
            await db.menu_items.insert_many(items)
            logging.info(f\"Seeded {len(items)} menu items\")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event(\"shutdown\")
async def shutdown_db_client():
    client.close()
"