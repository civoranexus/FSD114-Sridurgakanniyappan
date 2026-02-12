from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.api import deps
from app.models.course import Course, Subject
from app.models.user import User
from app.schemas.education import CourseCreate, Course as CourseSchema, SubjectCreate, Subject as SubjectSchema

router = APIRouter()

@router.get("/", response_model=List[CourseSchema])
def read_courses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve courses.
    """
    courses = db.query(Course).options(joinedload(Course.lessons)).offset(skip).limit(limit).all()
    return courses

@router.post("/", response_model=CourseSchema)
def create_course(
    *,
    db: Session = Depends(deps.get_db),
    course_in: CourseCreate,
    current_user: User = Depends(deps.get_current_active_teacher),
) -> Any:
    """
    Create new course. Teacher or Admin only.
    """
    course = Course(**course_in.model_dump(), teacher_id=current_user.id)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.post("/{course_id}/subjects/", response_model=SubjectSchema)
def create_subject(
    *,
    db: Session = Depends(deps.get_db),
    course_id: int,
    subject_in: SubjectCreate,
    current_user: User = Depends(deps.get_current_active_teacher),
) -> Any:
    """
    Create new subject for a course.
    """
    subject = Subject(**subject_in.model_dump()) 
    # Logic to check if user teaches this course could be added
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject
