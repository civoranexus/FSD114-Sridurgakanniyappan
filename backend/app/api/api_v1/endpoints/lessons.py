from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.lesson import Lesson
from app.schemas.lesson import LessonCreate, LessonUpdate, Lesson as LessonSchema

router = APIRouter()

@router.post("/", response_model=LessonSchema)
def create_lesson(
    *,
    db: Session = Depends(deps.get_db),
    lesson_in: LessonCreate,
    current_user = Depends(deps.get_current_active_teacher),
) -> Any:
    lesson = Lesson(
        title=lesson_in.title,
        content=lesson_in.content,
        video_url=lesson_in.video_url,
        pdf_file=lesson_in.pdf_file,
        order=lesson_in.order,
        course_id=lesson_in.course_id
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

@router.get("/{lesson_id}", response_model=LessonSchema)
def read_lesson(
    lesson_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.put("/{lesson_id}", response_model=LessonSchema)
def update_lesson(
    *,
    db: Session = Depends(deps.get_db),
    lesson_id: int,
    lesson_in: LessonUpdate,
    current_user = Depends(deps.get_current_active_teacher),
) -> Any:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    lesson_data = lesson_in.dict(exclude_unset=True)
    for field, value in lesson_data.items():
        setattr(lesson, field, value)
        
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson
