from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.ebook import EBook
from app.schemas.ebook import EBookCreate, EBookUpdate, EBookResponse
from app.api.deps import get_admin_user
from app.utils.file_upload import save_upload_file
import os
from app.config import settings

router = APIRouter(prefix="/ebooks", tags=["EBooks"])

# 307 FIX: Remove "/" from route decorators
@router.get("", response_model=List[EBookResponse])
async def get_ebooks(
    sort: str = "DESC",
    limit: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all ebooks"""
    query = db.query(EBook)

    if sort.upper() == "DESC":
        query = query.order_by(EBook.createddate.desc())
    else:
        query = query.order_by(EBook.createddate.asc())

    if limit:
        query = query.limit(limit)

    return query.all()

@router.post("", response_model=EBookResponse)
async def create_ebook(
    ebook: EBookCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Create new ebook (Admin only)"""
    db_ebook = EBook(**ebook.dict())
    db.add(db_ebook)
    db.commit()
    db.refresh(db_ebook)
    return db_ebook

@router.put("/{ebook_id}", response_model=EBookResponse)
async def update_ebook(
    ebook_id: int,
    ebook_data: EBookUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Update ebook (Admin only)"""
    db_ebook = db.query(EBook).filter(EBook.id == ebook_id).first()
    if not db_ebook:
        raise HTTPException(status_code=404, detail="EBook not found")

    for key, value in ebook_data.dict(exclude_unset=True).items():
        setattr(db_ebook, key, value)

    db.commit()
    db.refresh(db_ebook)
    return db_ebook

@router.delete("/{ebook_id}")
async def delete_ebook(
    ebook_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """Delete ebook (Admin only)"""
    db_ebook = db.query(EBook).filter(EBook.id == ebook_id).first()
    if not db_ebook:
        raise HTTPException(status_code=404, detail="EBook not found")

    db.delete(db_ebook)
    db.commit()
    return {"msg": "EBook deleted successfully"}

@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user = Depends(get_admin_user)
):
    """Upload PDF file (Admin only)"""
    if not file.content_type == "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    upload_dir = os.path.join(settings.UPLOAD_DIR, "pdfs")
    filename = await save_upload_file(file, upload_dir)

    return {"filename": filename}

@router.post("/upload-cover")
async def upload_cover(
    file: UploadFile = File(...),
    current_user = Depends(get_admin_user)
):
    """Upload cover image (Admin only)"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    upload_dir = os.path.join(settings.UPLOAD_DIR, "coverpages")
    filename = await save_upload_file(file, upload_dir)

    return {"filename": f"/coverpages/{filename}"}
