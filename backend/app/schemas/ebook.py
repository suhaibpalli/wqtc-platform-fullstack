from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class EBookBase(BaseModel):
    title: str
    filename: str
    cover_image: Optional[str] = Field(None, serialization_alias="coverImage")
    description: Optional[str] = None
    pages: Optional[int] = None

class EBookCreate(EBookBase):
    pass

class EBookUpdate(BaseModel):
    title: Optional[str] = None
    cover_image: Optional[str] = Field(None, serialization_alias="coverImage")
    description: Optional[str] = None
    pages: Optional[int] = None

class EBookResponse(EBookBase):
    id: int
    createdby: str
    createddate: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
