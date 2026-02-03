from sqlalchemy import Column, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=True)
    completed = Column(Boolean, default=False)
    
    # Check dependencies for relationships
    # student = relationship("User")
    # course = relationship("Course")
    # lesson = relationship("Lesson")
    # quiz = relationship("Quiz")
