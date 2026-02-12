from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.assignment import Assignment, Submission, Result
from app.models.user import User
from app.schemas.education import (
    AssignmentCreate, Assignment as AssignmentSchema,
    SubmissionCreate, Submission as SubmissionSchema,
    ResultCreate, Result as ResultSchema
)

router = APIRouter()

@router.post("/", response_model=AssignmentSchema)
def create_assignment(
    *,
    db: Session = Depends(deps.get_db),
    assignment_in: AssignmentCreate,
    current_user: User = Depends(deps.get_current_active_teacher),
) -> Any:
    assignment = Assignment(**assignment_in.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

@router.get("/course/{course_id}", response_model=List[AssignmentSchema])
def read_assignments(
    course_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()
    return assignments

@router.post("/submit", response_model=SubmissionSchema)
def submit_assignment(
    *,
    db: Session = Depends(deps.get_db),
    submission_in: SubmissionCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    submission = Submission(
        **submission_in.model_dump(),
        student_id=current_user.id,
        submitted_at=datetime.utcnow()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

@router.post("/grade", response_model=ResultSchema)
def grade_submission(
    *,
    db: Session = Depends(deps.get_db),
    result_in: ResultCreate,
    current_user: User = Depends(deps.get_current_active_teacher),
) -> Any:
    result = Result(**result_in.model_dump())
    db.add(result)
    db.commit()
    db.refresh(result)
    return result
