from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserResponse

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "student"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    message: str
    success: bool

class RegisterResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse

@router.post("/login", response_model=LoginResponse)
@router.post("/login/", response_model=LoginResponse, include_in_schema=False)
def login_access_token(
    db: Session = Depends(deps.get_db), login_data: LoginRequest = Body(...)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not security.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "message": "Login successful",
        "success": True
    }

@router.post("/register", response_model=RegisterResponse)
@router.post("/register/", response_model=RegisterResponse, include_in_schema=False)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": "User registered successfully",
        "user": user
    }
