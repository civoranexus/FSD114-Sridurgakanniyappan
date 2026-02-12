from typing import List, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.enrollment import Enrollment

from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/teacher/students/{course_id}", response_model=List[UserResponse])
def get_students_for_course(
    course_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_teacher),
) -> Any:
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    student_ids = [e.student_id for e in enrollments]
    students = db.query(User).filter(User.id.in_(student_ids)).all()
    return students
