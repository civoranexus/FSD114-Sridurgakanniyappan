from typing import List, Optional, Any
from pydantic import BaseModel

class QuestionBase(BaseModel):
    text: str
    options: List[str]
    correct_option_index: int

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    quiz_id: int
    
    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    title: str

class QuizCreate(QuizBase):
    course_id: int
    questions: List[QuestionCreate]

class Quiz(QuizBase):
    id: int
    course_id: int
    questions: List[Question] = []

    class Config:
        orm_mode = True
