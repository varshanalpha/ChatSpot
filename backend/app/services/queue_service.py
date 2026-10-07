import datetime
from sqlalchemy.orm import Session
from app.models.models import Order, FoodItem

def generate_order_number(db: Session) -> str:
    """Generates unique order number like CS1024."""
    count = db.query(Order).count() + 1001
    return f"CS{count}"

def generate_token_number(db: Session) -> str:
    """Generates clean token number like A101, A102... rolls over letters."""
    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_orders = db.query(Order).filter(Order.created_at >= today_start).count()
    
    letter_idx = (today_orders // 100) % 26
    prefix = chr(ord('A') + letter_idx)
    num = (today_orders % 100) + 1
    return f"{prefix}{num:03d}"

def calculate_estimated_ready_time(db: Session, order_items_data: list) -> tuple[str, int]:
    """
    Smart kitchen queue algorithm:
    Calculates estimated ready time based on:
    - Base prep time of selected items (max of items + small overhead)
    - Active workload: number of orders currently in 'NEW', 'ACCEPTED', 'PREPARING'
    """
    # 1. Base preparation time for items
    item_prep_times = []
    for item in order_items_data:
        food = db.query(FoodItem).filter(FoodItem.id == item.food_item_id).first()
        if food:
            # Each additional quantity adds 1 minute
            additional_time = max(0, (item.quantity - 1) * 1)
            item_prep_times.append(food.preparation_time + additional_time)
    
    base_time = max(item_prep_times) if item_prep_times else 10

    # 2. Kitchen load impact:
    # Count pending orders in kitchen
    active_kitchen_orders = db.query(Order).filter(
        Order.status.in_(["NEW", "ACCEPTED", "PREPARING"])
    ).count()

    # Each 2 active orders in front adds roughly 2-3 mins of queue wait
    queue_delay = int(active_kitchen_orders * 1.5)
    total_minutes = max(8, base_time + queue_delay)

    # Compute target time string
    ready_datetime = datetime.datetime.now() + datetime.timedelta(minutes=total_minutes)
    ready_time_str = ready_datetime.strftime("%I:%M %p")

    return ready_time_str, total_minutes
