from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
import enum
from app.db.session import Base

class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class CourseApproval(Base):
    __tablename__ = "course_approvals"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), unique=True)
    status = Column(String, default=ApprovalStatus.PENDING)
    feedback = Column(Text, nullable=True)

    course = relationship("Course", backref="approval")
