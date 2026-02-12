from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.notification import Notification
from app.models.user import User
from app.schemas.education import Notification as NotificationSchema

router = APIRouter()

@router.get("/", response_model=List[NotificationSchema])
def read_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get notifications for current user.
    """
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).offset(skip).limit(limit).all()
    return notifications
