from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.course import Course
from app.models.progress import Progress
from app.models.enrollment import Enrollment
from app.models.certificate import Certificate
from app.schemas.education import Course as CourseSchema
from app.schemas.certificate import CertificateResponse

router = APIRouter()

@router.get("/courses/browse", response_model=List[CourseSchema])
def browse_courses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    try:
        courses = db.query(Course).offset(skip).limit(limit).all()
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Browse error: {str(e)}")

@router.get("/courses/my", response_model=List[CourseSchema])
def my_courses(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    try:
        # Assuming Enrollment model links user and course
        enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
        ids = [e.course_id for e in enrollments]
        courses = db.query(Course).filter(Course.id.in_(ids)).all()
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"My courses error: {str(e)}")

@router.get("/certificates/my", response_model=List[CertificateResponse])
def my_certificates(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    try:
        certs = db.query(Certificate).filter(Certificate.student_id == current_user.id).all()
        results = []
        for cert in certs:
            results.append({
                "id": cert.id,
                "student_id": cert.student_id,
                "course_id": cert.course_id,
                "certificate_id": cert.certificate_id,
                "issued_date": cert.issued_date,
                "course_title": cert.course.title if cert.course else "Unknown Course"
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Certificates error: {str(e)}")
