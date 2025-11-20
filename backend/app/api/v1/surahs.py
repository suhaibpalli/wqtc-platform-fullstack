from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.surah import Surah
from app.schemas.surah import SurahResponse, SurahCreate
from app.schemas.common import ResponseBase
from app.api.deps import get_admin_user  # Import admin security

router = APIRouter(prefix="/surah", tags=["Surah"])

@router.get("", response_model=ResponseBase[List[SurahResponse]])
async def get_all_surahs(db: Session = Depends(get_db)):
    surahs = db.query(Surah).order_by(Surah.id.asc()).all()
    return {"code": 200, "msg": "Success", "result": surahs}

# NEW: Create Surah Endpoint
@router.post("", response_model=ResponseBase[SurahResponse])
async def create_surah(
    surah: SurahCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    if db.query(Surah).filter(Surah.id == surah.id).first():
        raise HTTPException(status_code=400, detail=f"Surah with ID {surah.id} already exists")
    db_surah = Surah(**surah.dict())
    db.add(db_surah)
    db.commit()
    db.refresh(db_surah)
    return {"code": 200, "msg": "Surah added successfully", "result": db_surah}

# NEW: Delete Surah Endpoint
@router.delete("/{surah_id}")
async def delete_surah(
    surah_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    surah = db.query(Surah).filter(Surah.id == surah_id).first()
    if not surah:
        raise HTTPException(status_code=404, detail="Surah not found")
    db.delete(surah)
    db.commit()
    return {"code": 200, "msg": "Surah deleted"}