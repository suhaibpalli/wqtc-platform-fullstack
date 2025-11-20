from fastapi import APIRouter, Depends, HTTPException, status, Response
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
    
    # UPDATED COOKIE SETTINGS FOR LOCALHOST DEVELOPMENT
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False,      # Keep False for http://localhost
        samesite="lax",    # 'lax' is usually fine, but 'none' requires secure=True
        max_age=7*24*60*60,
        path="/"           # <--- CRITICAL: Ensure path is root so it's valid for all routes
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
