import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ChatSpot Canteen System"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chatspot-campus-super-secret-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database: Use DATABASE_URL from environment or fallback to sqlite
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./chatspot.db")

    # Payment config
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_chatspot123")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "mock_secret_key_campus")
    MOCK_PAYMENT_MODE: bool = True

    # Canteen details
    CANTEEN_NAME: str = "ChatSpot Central Canteen"
    CANTEEN_OPEN_TIME: str = "08:00"
    CANTEEN_CLOSE_TIME: str = "20:00"
    AVG_PREP_TIME_MINS: int = 12

    class Config:
        case_sensitive = True

settings = Settings()
