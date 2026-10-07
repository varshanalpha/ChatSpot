from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Order, OrderItem, FoodItem, User, Notification
from app.schemas.schemas import OrderCreate, OrderResponse
from app.api.deps import get_current_user, get_current_user_optional
from app.services.queue_service import (
    generate_order_number,
    generate_token_number,
    calculate_estimated_ready_time
)
from app.services.payment_service import create_payment_order

router = APIRouter(prefix="/orders", tags=["orders"])

def build_order_response(order: Order) -> OrderResponse:
    student_name = order.user.name if order.user else "Campus Student"
    student_id_val = order.user.student_id if order.user else "STU-001"
    student_phone = order.user.phone if order.user else ""

    items_res = [
        {
            "id": it.id,
            "food_item_id": it.food_item_id,
            "item_name": it.item_name,
            "quantity": it.quantity,
            "price": it.price
        }
        for it in order.items
    ]

    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        token_number=order.token_number,
        user_id=order.user_id,
        status=order.status,
        payment_status=order.payment_status,
        subtotal=order.subtotal,
        total_amount=order.total_amount,
        pickup_counter=order.pickup_counter,
        estimated_ready_time=order.estimated_ready_time,
        estimated_minutes=order.estimated_minutes or 12,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items_res,
        student_name=student_name,
        student_id_val=student_id_val,
        student_phone=student_phone
    )

@router.post("", response_model=OrderResponse)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot place an empty order")

    # Security check: Calculate subtotal and total using verified DB prices
    subtotal = 0.0
    items_to_create = []

    for item in order_in.items:
        food = db.query(FoodItem).filter(FoodItem.id == item.food_item_id).first()
        if not food:
            raise HTTPException(status_code=400, detail=f"Food item {item.food_item_id} not found")
        if food.availability == "SOLD_OUT":
            raise HTTPException(status_code=400, detail=f"'{food.name}' is currently Sold Out")
        
        item_subtotal = food.price * item.quantity
        subtotal += item_subtotal

        items_to_create.append({
            "food_item_id": food.id,
            "item_name": food.name,
            "quantity": item.quantity,
            "price": food.price
        })

    total_amount = subtotal  # Platform fee is ₹0 for students

    # Calculate smart queue ready time
    ready_time_str, est_minutes = calculate_estimated_ready_time(db, order_in.items)

    order_num = generate_order_number(db)
    token_num = generate_token_number(db)

    new_order = Order(
        order_number=order_num,
        token_number=token_num,
        user_id=current_user.id,
        status="PENDING_PAYMENT",  # Will become NEW once payment is verified
        payment_status="PENDING",
        subtotal=subtotal,
        total_amount=total_amount,
        pickup_counter="Counter 1",
        estimated_ready_time=ready_time_str,
        estimated_minutes=est_minutes
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Add items
    for item_data in items_to_create:
        order_item = OrderItem(
            order_id=new_order.id,
            food_item_id=item_data["food_item_id"],
            item_name=item_data["item_name"],
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(order_item)

    db.commit()
    db.refresh(new_order)

    # Initialize payment record
    create_payment_order(db, new_order, payment_method=order_in.payment_method or "UPI")

    return build_order_response(new_order)

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()
    return [build_order_response(o) for o in orders]

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Students can only see their own orders unless staff/admin
    if current_user.role == "STUDENT" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to view this order")
    
    return build_order_response(order)

@router.get("/track/{token_or_id}", response_model=OrderResponse)
def track_order(token_or_id: str, db: Session = Depends(get_db)):
    """Public or student track endpoint by token (e.g. A127) or order number (CS1024)."""
    clean_query = token_or_id.strip().upper()
    order = db.query(Order).filter(
        (Order.order_number == clean_query) | (Order.token_number == clean_query)
    ).order_by(Order.created_at.desc()).first()

    if not order and clean_query.isdigit():
        order = db.query(Order).filter(Order.id == int(clean_query)).first()

    if not order:
        raise HTTPException(status_code=404, detail=f"No active order found with identifier {token_or_id}")

    return build_order_response(order)
