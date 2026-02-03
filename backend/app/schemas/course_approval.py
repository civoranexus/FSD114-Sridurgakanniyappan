from typing import Optional
from pydantic import BaseModel
from enum import Enum

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class CourseApprovalBase(BaseModel):
    status: ApprovalStatus
    feedback: Optional[str] = None

class CourseApprovalCreate(CourseApprovalBase):
    course_id: int

class CourseApprovalUpdate(BaseModel):
    status: ApprovalStatus
    feedback: Optional[str] = None

class CourseApproval(CourseApprovalBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True
