from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SubmissionBase(BaseModel):
    content_url: Optional[str] = None
    content_text: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    assignment_id: int

class SubmissionUpdate(BaseModel):
    grade: Optional[float] = None
    feedback: Optional[str] = None

class Submission(SubmissionBase):
    id: int
    assignment_id: int
    student_id: int
    grade: Optional[float] = None
    feedback: Optional[str] = None
    submitted_at: datetime

    class Config:
        from_attributes = True
