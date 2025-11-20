from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_
from typing import Optional, List
from app.database import get_db
from app.models.video import Video
from app.models.surah import Surah
from app.schemas.video import VideoResponse, VideoCreate, VideoUpdate
from app.schemas.common import ResponseBase
from app.api.deps import get_admin_user

router = APIRouter(prefix="/library", tags=["Library"])

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