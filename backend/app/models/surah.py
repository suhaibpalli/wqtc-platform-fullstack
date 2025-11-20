from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Surah(Base):
    __tablename__ = "surahs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    arabic_name = Column(String(100))
    english_name = Column(String(100))
    revelation_place = Column(String(50))
    total_verses = Column(Integer)
    description = Column(Text)
    
    # Relationship
    videos = relationship("Video", back_populates="surah")
