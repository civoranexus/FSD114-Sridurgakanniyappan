from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Any

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post("/login")
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not security.verify_password(form_data.password, user.hashed_password):
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
    }
@router.post("/register", response_model=UserResponse)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user    