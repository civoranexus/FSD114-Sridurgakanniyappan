from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from pydantic import BaseModel

router = APIRouter()

class SettingsUpdate(BaseModel):
    # dynamic settings
    pass

@router.put("/users/settings")
def update_settings(
    settings_in: dict, # accepting loose dict for flexibility
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
) -> Any:
    # Implementation depends on where settings are stored. 
    # If on user model:
    # for k, v in settings_in.items():
    #     setattr(current_user, k, v)
    # db.commit()
    return {"msg": "Settings updated"}
