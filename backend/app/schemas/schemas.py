from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    student_id: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "STUDENT"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- Category Schemas ---
class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    icon: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True

# --- FoodItem Schemas ---
class FoodItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[str] = None
    availability: Optional[str] = "AVAILABLE"  # AVAILABLE, LOW_STOCK, SOLD_OUT
    stock_quantity: Optional[int] = 50
    preparation_time: Optional[int] = 10
    is_veg: Optional[bool] = False

class FoodItemCreate(FoodItemBase):
    pass

class FoodItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    availability: Optional[str] = None
    stock_quantity: Optional[int] = None
    preparation_time: Optional[int] = None
    is_veg: Optional[bool] = None

class FoodItemResponse(FoodItemBase):
    id: int
    rating: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Order Item Schemas ---
class OrderItemCreate(BaseModel):
    food_item_id: int
    quantity: int = Field(gt=0)

class OrderItemResponse(BaseModel):
    id: int
    food_item_id: int
    item_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    student_name: Optional[str] = None
    student_id: Optional[str] = None
    phone: Optional[str] = None
    payment_method: Optional[str] = "UPI"

class OrderStatusUpdate(BaseModel):
    status: str  # ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED

class OrderResponse(BaseModel):
    id: int
    order_number: str
    token_number: str
    user_id: int
    status: str
    payment_status: str
    subtotal: float
    total_amount: float
    pickup_counter: str
    estimated_ready_time: Optional[str] = None
    estimated_minutes: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    items: List[OrderItemResponse]
    student_name: Optional[str] = None
    student_id_val: Optional[str] = None
    student_phone: Optional[str] = None

    class Config:
        from_attributes = True

# --- Payment Schemas ---
class PaymentCreateRequest(BaseModel):
    order_id: int
    payment_method: str = "UPI"  # UPI, CAMPUS_WALLET, CARD

class PaymentCreateResponse(BaseModel):
    order_id: int
    order_number: str
    token_number: str
    amount: float
    payment_reference: str
    gateway_key: str
    mock_mode: bool

class PaymentVerifyRequest(BaseModel):
    order_id: int
    payment_reference: str
    payment_status: str = "SUCCESSFUL"  # SUCCESSFUL or FAILED (for testing)
    payment_method: Optional[str] = "UPI"

class PaymentVerifyResponse(BaseModel):
    success: bool
    message: str
    order_id: int
    order_number: str
    token_number: str
    status: str
    estimated_ready_time: str

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    order_id: Optional[int]
    title: str
    message: str
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Crowd & Live Canteen Status ---
class CanteenStatusResponse(BaseModel):
    canteen_name: str
    crowd_level: str  # LOW, MODERATE, HIGH
    crowd_label: str  # "Low Crowd", "Moderate", "High Crowd"
    crowd_color: str  # green, yellow, red
    active_orders_count: int
    pending_orders_count: int
    preparing_orders_count: int
    ready_orders_count: int
    estimated_wait_time_minutes: int
    is_open: bool

# --- Analytics Schemas ---
class HourlyOrders(BaseModel):
    hour: str
    orders: int
    revenue: float

class PopularItem(BaseModel):
    name: str
    orders_count: int
    revenue: float

class AnalyticsResponse(BaseModel):
    total_orders_today: int
    total_revenue_today: float
    average_order_value: float
    completed_orders_today: int
    cancelled_orders_today: int
    pending_orders_today: int
    preparing_orders_today: int
    ready_orders_today: int
    peak_ordering_time: str
    average_preparation_time: str
    popular_items: List[PopularItem]
    hourly_trends: List[HourlyOrders]
