from typing import Optional, List
from pydantic import BaseModel

class LessonBase(BaseModel):
    title: str
    content: str
    video_url: Optional[str] = None
    pdf_file: Optional[str] = None
    order: int = 0

class LessonCreate(LessonBase):
    course_id: int

class LessonUpdate(LessonBase):
    pass

class Lesson(LessonBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True
