from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.registration import ClassRegistration
from app.schemas.registration import RegistrationCreate, RegistrationResponse, RegistrationUpdate
from app.schemas.common import ResponseBase
from app.api.deps import get_admin_user

router = APIRouter(prefix="/class-registration", tags=["Registrations"])

@router.post("", response_model=ResponseBase[RegistrationResponse])  # Remove slash for 307 fix
async def create_registration(
    reg_data: RegistrationCreate,
    db: Session = Depends(get_db)
):
    # 1. Combine extra info into notes for DB storage
    combined_notes = (
        f"{reg_data.additionalNotes or ''} | "
        f"Class Type: {reg_data.classType} | "
        f"Contact: {reg_data.contactNumber}"
    )

    # 2. Create DB Object (Map Frontend -> DB)
    new_reg = ClassRegistration(
        name=reg_data.name,
        email=reg_data.email,
        phone=reg_data.phone,
        country=reg_data.country,
        preferred_language=reg_data.language,
        preferred_day=reg_data.days,
        preferred_time=reg_data.timing,
        status="pending",
        notes=combined_notes
    )

    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)

    # 3. Construct Response (Map DB/Input -> Frontend Schema)
    # This fixes the ResponseValidationError
    response_data = {
        "id": new_reg.id,
        "name": new_reg.name,
        "email": new_reg.email,
        "phone": new_reg.phone,
        "whatsapp": reg_data.whatsapp,     # Pass through from input
        "country": new_reg.country,
        "language": new_reg.preferred_language, # Map back: preferred_language -> language
        "classType": reg_data.classType,   # Pass through from input
        "timing": new_reg.preferred_time,  # Map back: preferred_time -> timing
        "days": new_reg.preferred_day,     # Map back: preferred_day -> days
        "contactNumber": reg_data.contactNumber, # Pass through from input
        "additionalNotes": reg_data.additionalNotes,
        "status": new_reg.status,
        "registered_at": new_reg.registered_at
    }

    return {
        "code": 200, 
        "msg": "Registration successful! We will contact you on WhatsApp soon.", 
        "result": response_data
    }

@router.get("", response_model=ResponseBase[List[RegistrationResponse]])  # Remove slash for 307 fix
async def get_registrations(
    status: Optional[str] = None,
    language: Optional[str] = None,
    page: int = 1,
    perPage: int = 20,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    query = db.query(ClassRegistration)

    if status and status != 'all':
        query = query.filter(ClassRegistration.status == status)
    if language and language != 'all':
        query = query.filter(ClassRegistration.preferred_language == language)
        
    total = query.count()
    registrations_db = query.order_by(ClassRegistration.registered_at.desc())\
                            .offset((page - 1) * perPage)\
                            .limit(perPage)\
                            .all()

    # Manual Mapping: DB Object -> Response Schema
    mapped_registrations = []
    for reg in registrations_db:
        # In a production scenario, you'd want to parse these if possible out of reg.notes!
        mapped_registrations.append({
            "id": reg.id,
            "name": reg.name,
            "email": reg.email,
            "phone": reg.phone,
            "whatsapp": reg.phone,  # Fallback if not stored separately
            "country": reg.country,
            "language": reg.preferred_language,  # Map from DB
            "days": reg.preferred_day,           # Map from DB
            "timing": reg.preferred_time,        # Map from DB
            "classType": "General",              # Placeholder or parse from reg.notes
            "contactNumber": reg.phone,          # Fallback if not stored separately
            "additionalNotes": reg.notes,        # Stores note + extra info
            "status": reg.status,
            "registered_at": reg.registered_at
        })

    return {"code": 200, "msg": "Success", "result": mapped_registrations}

@router.put("/{reg_id}", response_model=ResponseBase[RegistrationResponse])
async def update_status(
    reg_id: int,
    update_data: RegistrationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    reg = db.query(ClassRegistration).filter(ClassRegistration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    reg.status = update_data.status
    db.commit()
    db.refresh(reg)

    # Manual Mapping: DB Object -> Response Schema
    response_data = {
        "id": reg.id,
        "name": reg.name,
        "email": reg.email,
        "phone": reg.phone,
        "whatsapp": reg.phone,  # Fallback
        "country": reg.country,
        "language": reg.preferred_language,
        "days": reg.preferred_day,
        "timing": reg.preferred_time,
        "classType": "General",  # placeholder
        "contactNumber": reg.phone,
        "additionalNotes": reg.notes,
        "status": reg.status,
        "registered_at": reg.registered_at
    }

    return {"code": 200, "msg": "Status updated", "result": response_data}