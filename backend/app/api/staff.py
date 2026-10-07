from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Order, FoodItem, Notification, User
from app.schemas.schemas import (
    OrderResponse,
    OrderStatusUpdate,
    FoodItemCreate,
    FoodItemUpdate,
    FoodItemResponse
)
from app.api.deps import get_current_staff
from app.api.orders import build_order_response

router = APIRouter(prefix="/staff", tags=["staff"])

@router.get("/orders", response_model=List[OrderResponse])
def get_staff_orders(
    status_filter: Optional[str] = None,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    query = db.query(Order).filter(Order.status != "PENDING_PAYMENT")
    
    if status_filter:
        query = query.filter(Order.status == status_filter.upper())
    
    # Sort orders: active kitchen orders first, latest first
    orders = query.order_by(Order.created_at.desc()).all()
    return [build_order_response(o) for o in orders]

@router.patch("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = status_in.status.upper()
    valid_statuses = ["NEW", "ACCEPTED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status '{new_status}'")

    order.status = new_status

    # Trigger student notifications based on status progression
    if new_status == "ACCEPTED":
        notif = Notification(
            user_id=order.user_id,
            order_id=order.id,
            title="Order Accepted 👨‍🍳",
            message=f"ChatSpot canteen has accepted Order #{order.order_number}. Preparing soon!",
            is_read=False
        )
        db.add(notif)
    elif new_status == "PREPARING":
        notif = Notification(
            user_id=order.user_id,
            order_id=order.id,
            title="Food is Cooking! 🔥",
            message=f"Your meal for Order #{order.order_number} (Token {order.token_number}) is on the flame.",
            is_read=False
        )
        db.add(notif)
    elif new_status == "READY":
        notif = Notification(
            user_id=order.user_id,
            order_id=order.id,
            title="🔔 Order Ready for Pickup!",
            message=f"Your ChatSpot order #{order.order_number} is READY at {order.pickup_counter}! Token: {order.token_number}. Please collect now.",
            is_read=False
        )
        db.add(notif)
    elif new_status == "COMPLETED":
        notif = Notification(
            user_id=order.user_id,
            order_id=order.id,
            title="Order Collected ✨",
            message=f"Order #{order.order_number} handed over. Enjoy your meal! Thank you for using ChatSpot.",
            is_read=False
        )
        db.add(notif)

    db.commit()
    db.refresh(order)
    return build_order_response(order)

# --- Menu Management Endpoints ---
@router.post("/menu", response_model=FoodItemResponse)
def add_menu_item(
    item_in: FoodItemCreate,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    item = FoodItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.patch("/menu/{item_id}", response_model=FoodItemResponse)
def update_menu_item(
    item_id: int,
    item_in: FoodItemUpdate,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/menu/{item_id}")
def delete_menu_item(
    item_id: int,
    current_staff: User = Depends(get_current_staff),
    db: Session = Depends(get_db)
):
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")

    db.delete(item)
    db.commit()
    return {"message": "Food item deleted successfully"}
