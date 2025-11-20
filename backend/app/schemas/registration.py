from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegistrationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    whatsapp: Optional[str] = None
    country: str = "India"
    language: str
    classType: str
    timing: str
    days: str
    contactNumber: str
    additionalNotes: Optional[str] = None

class RegistrationUpdate(BaseModel):
    status: str

class RegistrationResponse(RegistrationCreate):
    id: int
    status: str
    registered_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True  # Enable aliasing if you later use serialization_alias