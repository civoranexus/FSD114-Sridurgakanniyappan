from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.models.enrollment import Enrollment
from app.models.user import User
from app.schemas.education import EnrollmentCreate, Enrollment as EnrollmentSchema

router = APIRouter()


@router.post("/", response_model=EnrollmentSchema)
def enroll_student(
    enrollment_in: EnrollmentCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:

    enrollment = Enrollment(
        student_id=current_user.id,
        course_id=enrollment_in.course_id,
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment
