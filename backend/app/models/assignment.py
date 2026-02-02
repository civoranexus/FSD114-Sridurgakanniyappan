from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    due_date = Column(DateTime)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text) # URL or text
    submitted_at = Column(DateTime)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", backref="submissions")
    result = relationship("Result", uselist=False, back_populates="submission")

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    score = Column(Float)
    feedback = Column(Text, nullable=True)

    submission = relationship("Submission", back_populates="result")
