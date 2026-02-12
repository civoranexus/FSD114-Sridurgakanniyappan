from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.course import Course
from app.models.user import User
from app.models.course_approval import CourseApproval, ApprovalStatus
from app.schemas.course_approval import CourseApprovalUpdate, CourseApproval as CourseApprovalSchema

router = APIRouter()

@router.get("/admin/courses/pending", response_model=List[CourseApprovalSchema])
def get_pending_courses(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_admin),
) -> Any:
    # Assuming pending means no approval or status pending
    approvals = db.query(CourseApproval).filter(CourseApproval.status == "pending").all()
    # Or join with course
    # For now returning approvals, user can fetch course details if needed or we could return mixed data
    # Simplifying to return Course objects that have pending approval
    # But CourseApproval is a separate table.
    return approvals

@router.put("/admin/courses/{course_id}/approve")
def approve_course(
    course_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_admin),
) -> Any:
    approval = db.query(CourseApproval).filter(CourseApproval.course_id == course_id).first()
    if not approval:
        approval = CourseApproval(course_id=course_id, status=ApprovalStatus.PENDING)
        db.add(approval)
    
    approval.status = ApprovalStatus.APPROVED
    db.commit()
    return {"msg": "Course approved"}

@router.put("/admin/courses/{course_id}/reject")
def reject_course(
    course_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_admin),
) -> Any:
    approval = db.query(CourseApproval).filter(CourseApproval.course_id == course_id).first()
    if not approval:
        approval = CourseApproval(course_id=course_id, status=ApprovalStatus.PENDING)
        db.add(approval)
    
    approval.status = ApprovalStatus.REJECTED
    db.commit()
    return {"msg": "Course rejected"}

@router.put("/admin/users/{user_id}/block")
def block_user(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_admin),
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False # details depend on User model
    db.commit()
    return {"msg": "User blocked"}
