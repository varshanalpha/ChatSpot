from sqlalchemy.orm import Session
from app.models.models import Order
from app.schemas.schemas import CanteenStatusResponse
from app.core.config import settings

def get_live_canteen_status(db: Session) -> CanteenStatusResponse:
    """
    Calculates live canteen load based on:
    - Active kitchen orders (NEW, ACCEPTED, PREPARING)
    - Ready orders awaiting pickup
    """
    pending = db.query(Order).filter(Order.status.in_(["NEW", "ACCEPTED"])).count()
    preparing = db.query(Order).filter(Order.status == "PREPARING").count()
    ready = db.query(Order).filter(Order.status == "READY").count()

    active_total = pending + preparing

    if active_total <= 5:
        level = "LOW"
        label = "Low Crowd"
        color = "green"
        est_wait = 8
    elif active_total <= 14:
        level = "MODERATE"
        label = "Moderate Crowd"
        color = "yellow"
        est_wait = 15
    else:
        level = "HIGH"
        label = "High Crowd"
        color = "red"
        est_wait = 25

    return CanteenStatusResponse(
        canteen_name=settings.CANTEEN_NAME,
        crowd_level=level,
        crowd_label=label,
        crowd_color=color,
        active_orders_count=active_total,
        pending_orders_count=pending,
        preparing_orders_count=preparing,
        ready_orders_count=ready,
        estimated_wait_time_minutes=est_wait,
        is_open=True
    )
