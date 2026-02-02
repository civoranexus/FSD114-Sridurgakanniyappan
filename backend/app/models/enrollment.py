from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", backref="enrollments")
    course = relationship("Course", back_populates="enrollments")
    attendance_records = relationship("Attendance", back_populates="enrollment")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="present") # present, absent, late

    enrollment = relationship("Enrollment", back_populates="attendance_records")
