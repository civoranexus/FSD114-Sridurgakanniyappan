from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.progress import Progress
from app.schemas.progress import Progress as ProgressSchema

router = APIRouter()

@router.get("/{course_id}", response_model=List[ProgressSchema])
def get_course_progress(
    course_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    progress = db.query(Progress).filter(
        Progress.student_id == current_user.id,
        Progress.course_id == course_id
    ).all()
    return progress
