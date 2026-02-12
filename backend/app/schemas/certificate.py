from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class CertificateBase(BaseModel):
    course_id: int

class CertificateCreate(CertificateBase):
    pass

class CertificateResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    certificate_id: str
    issued_date: datetime
    course_title: str

    class Config:
        from_attributes = True
