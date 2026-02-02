from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import Any
import os
from datetime import datetime
from io import BytesIO

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

from app.api import deps
from app.models.user import User
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.certificate import Certificate
from app.schemas.certificate import CertificateResponse

router = APIRouter()

@router.post("/generate/{course_id}", response_model=CertificateResponse)
def generate_certificate(
    course_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a certificate for a completed course.
    Only enrolled students can generate certificates.
    """
    # 1. Verify enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()

    if not enrollment:
        raise HTTPException(status_code=400, detail="You are not enrolled in this course")

    # 2. Check if certificate already exists
    existing_cert = db.query(Certificate).filter(
        Certificate.student_id == current_user.id,
        Certificate.course_id == course_id
    ).first()

    if existing_cert:
        return {
            "id": existing_cert.id,
            "student_id": existing_cert.student_id,
            "course_id": existing_cert.course_id,
            "certificate_id": existing_cert.certificate_id,
            "issued_date": existing_cert.issued_date,
            "course_title": existing_cert.course.title
        }

    # 3. Create Certificate Record
    course = db.query(Course).filter(Course.id == course_id).first()
    new_cert = Certificate(
        student_id=current_user.id,
        course_id=course_id
    )
    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    
    return {
        "id": new_cert.id,
        "student_id": new_cert.student_id,
        "course_id": new_cert.course_id,
        "certificate_id": new_cert.certificate_id,
        "issued_date": new_cert.issued_date,
        "course_title": course.title
    }

@router.get("/download/{certificate_id}")
def download_certificate(
    certificate_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Download the certificate PDF.
    """
    cert = db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    student = cert.student
    course = cert.course

    # Generate PDF in memory
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Design the certificate
    p.setFont("Helvetica-Bold", 30)
    p.drawCentredString(width / 2.0, height - 100, "Certificate of Completion")
    
    p.setFont("Helvetica", 20)
    p.drawCentredString(width / 2.0, height - 200, "This is to certify that")
    
    p.setFont("Helvetica-Bold", 24)
    p.drawCentredString(width / 2.0, height - 250, student.full_name or student.email)
    
    p.setFont("Helvetica", 20)
    p.drawCentredString(width / 2.0, height - 300, "has successfully completed the course")
    
    p.setFont("Helvetica-Bold", 24)
    p.drawCentredString(width / 2.0, height - 350, course.title)
    
    p.setFont("Helvetica", 16)
    date_str = cert.issued_date.strftime("%B %d, %Y")
    p.drawCentredString(width / 2.0, height - 450, f"Date: {date_str}")
    
    p.setFont("Helvetica", 12)
    p.drawCentredString(width / 2.0, height - 500, f"Certificate ID: {cert.certificate_id}")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    
    headers = {
        'Content-Disposition': f'attachment; filename="certificate_{certificate_id}.pdf"'
    }
    return Response(content=buffer.getvalue(), media_type="application/pdf", headers=headers)
