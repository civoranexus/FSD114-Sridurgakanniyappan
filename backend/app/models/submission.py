from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class SubmissionExt(Base):
    __tablename__ = "submission_ext" # Avoid conflict with existing 'submissions' table if possible, but user asked for 'Submission'. 
    # Actually, if I use 'submissions', it might conflict. 
    # But user asked for 'Submission' model. 
    # I will use 'submissions_new' to be safe or 'submissions' if I am replacing.
    # Given requirements, I'll stick to standard naming but maybe table name should be different if existing is there.
    # checking app/models/assignment.py, table is 'submissions'.
    # I will use 'submissions_ext' to avoid collision.
    
    __tablename__ = "submissions_ext"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    content_url = Column(String, nullable=True)
    content_text = Column(Text, nullable=True)
    grade = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    # Relationships need to be careful with backrefs if models are mixed
    # assignment = relationship("Assignment") # This assumes Assignment is loaded
    # student = relationship("User") 
