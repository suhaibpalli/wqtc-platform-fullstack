from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class ClassRegistration(Base):
    __tablename__ = "class_registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    country = Column(String(100))
    preferred_language = Column(String(50))
    preferred_day = Column(String(50))
    preferred_time = Column(String(50))
    status = Column(String(50), default="pending")
    notes = Column(Text)
    registered_at = Column(DateTime(timezone=True), server_default=func.now())
