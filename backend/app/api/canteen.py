from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import CanteenStatusResponse
from app.services.crowd_service import get_live_canteen_status

router = APIRouter(prefix="/canteen", tags=["canteen"])

@router.get("/status", response_model=CanteenStatusResponse)
def get_canteen_status(db: Session = Depends(get_db)):
    """Live crowd estimation endpoint for students and staff."""
    return get_live_canteen_status(db)
