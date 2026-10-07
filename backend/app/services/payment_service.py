import uuid
import datetime
from sqlalchemy.orm import Session
from app.models.models import Order, Payment, Notification
from app.schemas.schemas import PaymentCreateResponse, PaymentVerifyResponse
from app.core.config import settings

def create_payment_order(db: Session, order: Order, payment_method: str = "UPI") -> PaymentCreateResponse:
    """Creates a payment transaction record linked to the order."""
    ref = f"PAY-{order.order_number}-{uuid.uuid4().hex[:6].upper()}"
    
    # Check if payment record already exists
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if not payment:
        payment = Payment(
            order_id=order.id,
            payment_reference=ref,
            amount=order.total_amount,
            status="PENDING",
            payment_method=payment_method
        )
        db.add(payment)
    else:
        payment.payment_reference = ref
        payment.status = "PENDING"
        payment.payment_method = payment_method
    
    db.commit()
    db.refresh(payment)

    return PaymentCreateResponse(
        order_id=order.id,
        order_number=order.order_number,
        token_number=order.token_number,
        amount=order.total_amount,
        payment_reference=payment.payment_reference,
        gateway_key=settings.RAZORPAY_KEY_ID,
        mock_mode=settings.MOCK_PAYMENT_MODE
    )

def verify_payment_transaction(
    db: Session,
    order_id: int,
    payment_reference: str,
    payment_status: str = "SUCCESSFUL",
    payment_method: str = "UPI"
) -> PaymentVerifyResponse:
    """
    Verifies payment and moves order from PENDING to confirmed state (status: NEW).
    Only upon verified payment does the order enter the canteen kitchen queue!
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise ValueError("Order not found")

    payment = db.query(Payment).filter(Payment.order_id == order_id).first()
    if not payment:
        payment = Payment(
            order_id=order.id,
            payment_reference=payment_reference,
            amount=order.total_amount,
            status=payment_status,
            payment_method=payment_method
        )
        db.add(payment)
    else:
        payment.status = payment_status
        payment.payment_method = payment_method

    if payment_status == "SUCCESSFUL":
        order.payment_status = "SUCCESSFUL"
        order.status = "NEW"  # Sent to Canteen!
        
        # Create student confirmation notification
        notification = Notification(
            user_id=order.user_id,
            order_id=order.id,
            title="Order Placed Successfully! 🍳",
            message=f"Order #{order.order_number} confirmed. Your Token is {order.token_number}. We are preparing your food!",
            is_read=False
        )
        db.add(notification)
        
        db.commit()
        db.refresh(order)

        return PaymentVerifyResponse(
            success=True,
            message="Payment verified successfully. Order sent to canteen kitchen.",
            order_id=order.id,
            order_number=order.order_number,
            token_number=order.token_number,
            status=order.status,
            estimated_ready_time=order.estimated_ready_time or "12-15 mins"
        )
    else:
        order.payment_status = "FAILED"
        db.commit()
        return PaymentVerifyResponse(
            success=False,
            message="Payment was not successful. Please try again.",
            order_id=order.id,
            order_number=order.order_number,
            token_number=order.token_number,
            status="PAYMENT_FAILED",
            estimated_ready_time=""
        )
