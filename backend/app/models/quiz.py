from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", backref="quizzes")
    questions = relationship("Question", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    text = Column(String)
    options = Column(JSON)  # List of options
    correct_option_index = Column(Integer)

    quiz = relationship("Quiz", back_populates="questions")
