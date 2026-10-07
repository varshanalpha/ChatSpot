import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    student_id = Column(String(50), unique=True, index=True, nullable=True)
    role = Column(String(20), default="STUDENT", nullable=False)  # STUDENT, STAFF, ADMIN
    hashed_password = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    year = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    icon = Column(String(50), nullable=True)
    display_order = Column(Integer, default=0)

    food_items = relationship("FoodItem", back_populates="category_rel")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    image_url = Column(String(500), nullable=True)
    availability = Column(String(20), default="AVAILABLE")  # AVAILABLE, LOW_STOCK, SOLD_OUT
    stock_quantity = Column(Integer, default=50)
    preparation_time = Column(Integer, default=10)  # minutes
    is_veg = Column(Boolean, default=False)
    rating = Column(Float, default=4.5)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category_rel = relationship("Category", back_populates="food_items")
    order_items = relationship("OrderItem", back_populates="food_item")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True, nullable=False)  # e.g. CS1024
    token_number = Column(String(20), index=True, nullable=False)              # e.g. A127
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="NEW", index=True)  # NEW, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED
    payment_status = Column(String(20), default="PENDING")  # PENDING, PROCESSING, SUCCESSFUL, FAILED, REFUNDED
    subtotal = Column(Float, nullable=False, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)
    pickup_counter = Column(String(20), default="Counter 1")
    estimated_ready_time = Column(String(50), nullable=True)
    estimated_minutes = Column(Integer, default=12)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    food_item_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    item_name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Float, nullable=False)  # Price at the time of order!

    order = relationship("Order", back_populates="items")
    food_item = relationship("FoodItem", back_populates="order_items")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    payment_reference = Column(String(100), unique=True, nullable=False)  # e.g. PAY-CS1024-UPI
    amount = Column(Float, nullable=False)
    status = Column(String(20), default="PENDING")  # PENDING, PROCESSING, SUCCESSFUL, FAILED, REFUNDED
    payment_method = Column(String(50), default="UPI")  # UPI, CAMPUS_WALLET, CARD, NETBANKING
    gateway_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    order = relationship("Order", back_populates="payment")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
    order = relationship("Order", back_populates="notifications")
