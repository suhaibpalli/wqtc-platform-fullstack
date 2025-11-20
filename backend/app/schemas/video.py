from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class VideoBase(BaseModel):
    title: str
    video_url: str = Field(..., serialization_alias="youTube_link")
    surah_no: int
    surah_name: Optional[str] = None
    starting_ayah: Optional[int] = None
    ending_ayah: Optional[int] = None
    keywords: Optional[str] = None

class VideoCreate(VideoBase):
    pass

class VideoUpdate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    created_by: str
    created_date: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
