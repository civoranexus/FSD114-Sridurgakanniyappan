from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.lesson import Lesson

# --- Course ---
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    teacher_id: int
    lessons: List[Lesson] = Field(default_factory=list)
    
    class Config:
        from_attributes = True

# --- Subject ---
class SubjectBase(BaseModel):
    name: str

class SubjectCreate(SubjectBase):
    course_id: int

class Subject(SubjectBase):
    id: int
    course_id: int
    
    class Config:
        from_attributes = True

# --- Enrollment ---
class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    student_id: int # Optionally passed by admin, or inferred from token

class Enrollment(EnrollmentBase):
    id: int
    student_id: int
    enrollment_date: datetime
    
    class Config:
        from_attributes = True

# --- Assignment ---
class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: datetime

class AssignmentCreate(AssignmentBase):
    course_id: int

class Assignment(AssignmentBase):
    id: int
    course_id: int
    
    class Config:
        from_attributes = True

# --- Submission ---
class SubmissionBase(BaseModel):
    content: str

class SubmissionCreate(SubmissionBase):
    assignment_id: int

class Submission(SubmissionBase):
    id: int
    assignment_id: int
    student_id: int
    submitted_at: datetime
    
    class Config:
        from_attributes = True

# --- Result ---
class ResultBase(BaseModel):
    score: float
    feedback: Optional[str] = None

class ResultCreate(ResultBase):
    submission_id: int

class Result(ResultBase):
    id: int
    submission_id: int
    
    class Config:
        from_attributes = True

# --- Notification ---
class NotificationBase(BaseModel):
    message: str

class NotificationCreate(NotificationBase):
    user_id: int

class Notification(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
