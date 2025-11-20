from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Video(Base):
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    video_url = Column(String(500), nullable=False)
    surah_no = Column(Integer, ForeignKey("surahs.id"), nullable=False)
    surah_name = Column(String(100))
    starting_ayah = Column(Integer)
    ending_ayah = Column(Integer)
    keywords = Column(Text)
    created_by = Column(String(100), default="WQTCTeam")
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    surah = relationship("Surah", back_populates="videos")
