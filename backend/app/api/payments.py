from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Order
from app.schemas.schemas import (
    PaymentCreateRequest,
    PaymentCreateResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse
)
from app.api.deps import get_current_user
from app.services.payment_service import create_payment_order, verify_payment_transaction

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/create", response_model=PaymentCreateResponse)
def init_payment(
    req: PaymentCreateRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if current_user.role == "STUDENT" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    return create_payment_order(db, order, req.payment_method)

@router.post("/verify", response_model=PaymentVerifyResponse)
def verify_payment(
    req: PaymentVerifyRequest,
    db: Session = Depends(get_db)
):
    try:
        res = verify_payment_transaction(
            db=db,
            order_id=req.order_id,
            payment_reference=req.payment_reference,
            payment_status=req.payment_status,
            payment_method=req.payment_method or "UPI"
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")
