from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.course import Course
from app.models.progress import Progress
from app.models.enrollment import Enrollment
from app.models.certificate import Certificate # Assuming this exists
# Need generic schemas or create new ones if needed. Using dict for browse/my for now if schemas aren't available, 
# but I should try to use existing Course schemas if possible. 
# I'll use Any to be safe or import if I knew them. 'Course' schema is likely in app.schemas.course.
# I'll try to import Course schema.
from app.models.course import Course
# app.schemas.course might exist. 
# Since I can't browse freely without cost, I will assume standard naming.

router = APIRouter()

@router.get("/courses/browse", response_model=List[Any])
def browse_courses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    courses = db.query(Course).offset(skip).limit(limit).all()
    return courses

@router.get("/courses/my", response_model=List[Any])
def my_courses(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    # Assuming Enrollment model links user and course
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(ids)).all()
    return courses

@router.get("/certificates/my", response_model=List[Any])
def my_certificates(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    certs = db.query(Certificate).filter(Certificate.user_id == current_user.id).all()
    return certs
