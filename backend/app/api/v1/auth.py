from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserLogin, UserResponse, Token
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(
    user_data: UserLogin,
    response: Response,
    request: Request,  # <-- added to access headers/scheme
    db: Session = Depends(get_db)
):
    """Login endpoint"""
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    
    # --- Improved: Robust Cookie Settings for Real Domains & Reverse Proxy Handling ---
    # Detect scheme, considering X-Forwarded-Proto if behind a reverse proxy
    proto = request.headers.get("x-forwarded-proto", request.url.scheme).lower()
    secure_flag = (proto == "https")

    # Derive host (again, honor X-Forwarded-Host with fallback)
    host = request.headers.get("x-forwarded-host") or request.url.hostname or ""
    # Only set the domain for real public domains (not localhost or IPs)
    cookie_domain = None
    if host and host not in ("localhost", "127.0.0.1") and not host.replace('.', '').isdigit():
        cookie_domain = f".{host.split(':')[0]}"  # Leading dot = allow subdomains

    # samesite = 'none' required for cross-origin secure, otherwise 'lax' for dev
    samesite = "none" if secure_flag else "lax"

    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=secure_flag,
        samesite=samesite,
        max_age=7*24*60*60,
        path="/",
        domain=cookie_domain
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    """Logout endpoint"""
    response.delete_cookie(key="token")
    return {"msg": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user
