from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_
from typing import Optional, List
from app.database import get_db
from app.models.video import Video
from app.models.surah import Surah
from app.schemas.video import VideoResponse, VideoCreate, VideoUpdate
from app.schemas.common import ResponseBase
from app.api.deps import get_admin_user

import pandas as pd
import io
import re

router = APIRouter(prefix="/library", tags=["Library"])

def extract_youtube_id(url: str) -> str | None:
    if not isinstance(url, str):
        return None
    match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
    if match:
        return match.group(1)
    match = re.search(r'(?:embed\/|v\/|youtu.be\/)([0-9A-Za-z_-]{11})', url)
    return match.group(1) if match else None

@router.post("", response_model=ResponseBase[List[VideoResponse]])  # <-- No trailing slash
async def get_library_videos(
    payload: dict, # Using dict to accept the flexible search filters from frontend
    db: Session = Depends(get_db)
):
    """
    Filters videos by surah, verse (ayah), search term, sort, etc.
    Replicates the logic from Next.js api/library/route.ts
    """
    surah = payload.get("surah")
    versus = payload.get("versus")
    search = payload.get("search")
    sort = payload.get("sort", "DESC")
    limit = payload.get("limit")

    query = db.query(Video)

    # 1. Surah Filter
    if surah:
        query = query.filter(Video.surah_no == int(surah))

    # 2. Verse Filter (Complex Logic)
    # Logic: Match videos where the requested verse falls within starting_ayah and ending_ayah
    if versus:
        try:
            if isinstance(versus, str) and '-' in versus:
                # Range filter if passed as string "1-5"
                start, end = map(int, versus.split('-'))
                query = query.filter(
                    and_(
                        Video.starting_ayah >= start,
                        Video.ending_ayah <= end
                    )
                )
            else:
                # Single verse point check
                ayah_num = int(versus)
                # Video starts before or at this ayah AND ends after or at this ayah
                query = query.filter(
                    and_(
                        Video.starting_ayah <= ayah_num,
                        or_(Video.ending_ayah >= ayah_num, Video.ending_ayah.is_(None))
                    )
                )
        except ValueError:
            pass # Ignore invalid versus inputs

    # 3. Search Filter
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Video.title.ilike(search_pattern),
                Video.surah_name.ilike(search_pattern),
                Video.keywords.ilike(search_pattern)
            )
        )

    # 4. Sorting
    if sort.upper() == "ASC":
        query = query.order_by(Video.created_date.asc())
    else:
        query = query.order_by(Video.created_date.desc())

    # 5. Limiting
    if limit:
        query = query.limit(int(limit))

    videos = query.all()
    return {"code": 200, "msg": "Success", "result": videos}

# --- Admin Routes for Videos ---

@router.post("/create", response_model=ResponseBase[VideoResponse])
async def create_video(
    video: VideoCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    db_video = Video(**video.dict())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return {"code": 200, "msg": "Success", "result": db_video}

@router.delete("/{video_id}")
async def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    db.delete(video)
    db.commit()
    return {"code": 200, "msg": "Success", "result": None}

@router.post("/bulk-preview")
async def bulk_video_preview(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    1. Reads CSV/Excel
    2. Validates data types and logic
    3. Returns list of valid objects and list of errors
    """
    # 1. Read File
    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(400, "Invalid file format. Please upload CSV or Excel.")
    except Exception as e:
        raise HTTPException(400, f"Could not parse file: {str(e)}")

    # 2. Clean keys (trim spaces from headers)
    df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]
    
    # Expected headers mapping
    # We allow flexible headers, mapping them to our schema
    # title, url, surah, start, end
    
    valid_rows = []
    errors = []
    
    # Pre-fetch Surahs for validation
    existing_surahs = {s.id: s.name for s in db.query(Surah).all()}

    for index, row in df.iterrows():
        row_errors = []
        
        # Extract & Validate Data
        title = row.get('title', '')
        url = row.get('youtube_link', '') or row.get('video_url', '')
        surah_no = row.get('surah_no', 0)
        start = row.get('starting_ayah', 0)
        end = row.get('ending_ayah', None)
        keywords = row.get('keywords', '')

        # Validation Logic
        if not title or pd.isna(title):
            row_errors.append("Missing Title")
        if not url or pd.isna(url):
            row_errors.append("Missing URL")
        elif not extract_youtube_id(str(url)):
            row_errors.append("Invalid YouTube URL")
        
        try:
            s_no = int(surah_no)
            if s_no not in existing_surahs:
                row_errors.append(f"Surah {s_no} does not exist in DB")
        except:
            row_errors.append("Invalid Surah Number")
            s_no = None

        try:
            st_ayah = int(start)
        except:
            row_errors.append("Invalid Starting Ayah")
            st_ayah = None

        # Prepare Object
        if not row_errors:
            valid_rows.append({
                "title": str(title),
                "video_url": str(url),
                "surah_no": s_no,
                "surah_name": existing_surahs.get(s_no),
                "starting_ayah": st_ayah,
                "ending_ayah": int(end) if pd.notna(end) else None,
                "keywords": str(keywords) if pd.notna(keywords) else None
            })
        else:
            errors.append({
                "row": index + 2, # +2 because index 0 is row 2 in Excel (row 1 header)
                "data": {k: str(v) for k,v in row.items()},
                "issues": row_errors
            })

    return {
        "code": 200,
        "msg": "Preview generated",
        "result": {
            "valid": valid_rows,
            "invalid": errors,
            "total_parsed": len(df)
        }
    }

@router.post("/bulk-create")
async def bulk_create_videos(
    videos: List[VideoCreate],
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    """
    Receives the clean list from frontend and inserts them
    """
    count = 0
    for v in videos:
        db_video = Video(**v.dict())
        db.add(db_video)
        count += 1
    
    try:
        db.commit()
        return {"code": 200, "msg": f"Successfully imported {count} videos", "result": count}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Database error: {str(e)}")