from typing import Optional
from pydantic import BaseModel

class ProgressBase(BaseModel):
    completed: bool = False

class ProgressCreate(ProgressBase):
    course_id: int
    lesson_id: Optional[int] = None
    quiz_id: Optional[int] = None

class Progress(ProgressBase):
    id: int
    student_id: int
    course_id: int
    lesson_id: Optional[int] = None
    quiz_id: Optional[int] = None

    class Config:
        from_attributes = True
