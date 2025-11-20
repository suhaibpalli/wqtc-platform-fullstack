from pydantic import BaseModel
from typing import Optional

class SurahBase(BaseModel):
    name: str
    arabic_name: Optional[str] = None
    english_name: Optional[str] = None
    total_verses: Optional[int] = None
    revelation_place: Optional[str] = None  # Added for management

class SurahCreate(SurahBase):
    id: int  # Explicitly require ID to match Surah Number (1-114)

class SurahResponse(SurahBase):
    id: int

    class Config:
        from_attributes = True