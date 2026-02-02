from app.db.session import Base

# Import all models so SQLAlchemy registers them
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.enrollment import Enrollment
from app.models.notification import Notification
from app.models.certificate import Certificate
