from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import uuid

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    certificate_id = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    issued_date = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", backref="certificates")
    course = relationship("Course", backref="certificates")
