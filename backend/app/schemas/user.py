from typing import Optional
from pydantic import BaseModel, EmailStr

# Token
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int
    is_active: bool
    hashed_password: str

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
