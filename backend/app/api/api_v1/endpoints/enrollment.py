from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.user import User
from app.schemas.education import EnrollmentCreate, Enrollment as EnrollmentSchema

router = APIRouter()

@router.post("/", response_model=EnrollmentSchema)
def enroll_student(
    *,
    db: Session = Depends(deps.get_db),
    enrollment_in: EnrollmentCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Enroll a student in a course.
    """
    enrollment = Enrollment(
        student_id=current_user.id, # Force current user enrollment for now
        course_id=enrollment_in.course_id
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment
