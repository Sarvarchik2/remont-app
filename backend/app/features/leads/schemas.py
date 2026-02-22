from pydantic import BaseModel
from typing import Optional, Dict, Any

class CalculatorData(BaseModel):
    area: float
    type: str # 'new' | 'secondary'
    level: str # 'economy' | 'standard' | 'premium'
    estimatedCost: float

class BookingData(BaseModel):
    date: str
    time: str
    address: str
    comment: Optional[str] = None

class LeadBase(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    source: str
    status: str
    date: str
    time: str
    calculatorData: Optional[CalculatorData] = None
    bookingData: Optional[BookingData] = None
    notes: Optional[str] = None

class LeadCreate(LeadBase):
    id: str

class LeadResponse(LeadBase):
    id: str

    class Config:
        from_attributes = True
