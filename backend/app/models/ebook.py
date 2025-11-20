from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class EBook(Base):
    __tablename__ = "ebooks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    filename = Column(String(500), nullable=False)
    cover_image = Column(String(500))
    description = Column(Text)
    pages = Column(Integer)
    createdby = Column(String(100), default="WQTCTeam")
    createddate = Column(DateTime(timezone=True), server_default=func.now())
