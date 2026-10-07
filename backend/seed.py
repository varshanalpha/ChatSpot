import datetime
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.models import User, Category, FoodItem, Order, OrderItem, Payment, Notification

def seed():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Category).count() > 0:
            print("Database already contains data. Skipping full re-seed.")
            return

        print("Seeding ChatSpot database with realistic college canteen menu & users...")

        # 1. Categories
        categories_data = [
            {"name": "Breakfast", "slug": "breakfast", "icon": "Coffee", "display_order": 1},
            {"name": "Lunch", "slug": "lunch", "icon": "Utensils", "display_order": 2},
            {"name": "Snacks", "slug": "snacks", "icon": "Pizza", "display_order": 3},
            {"name": "Beverages", "slug": "beverages", "icon": "CupSoda", "display_order": 4},
            {"name": "Combos", "slug": "combos", "icon": "Sparkles", "display_order": 5},
        ]
        cat_map = {}
        for cat in categories_data:
            c = Category(**cat)
            db.add(c)
            db.flush()
            cat_map[c.slug] = c.id

        # 2. Food Items (Curated high quality images with realistic descriptions)
        food_items_data = [
            {
                "name": "Chicken Fried Rice",
                "description": "Fragrant wok-tossed basmati rice with tender chicken chunks, spring onions, and oriental spices.",
                "price": 80.0,
                "category_id": cat_map["lunch"],
                "image_url": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 45,
                "preparation_time": 10,
                "is_veg": False,
                "rating": 4.8
            },
            {
                "name": "Veg Fried Rice",
                "description": "Classic wok-tossed fried rice loaded with crispy garden veggies, carrots, and beans.",
                "price": 60.0,
                "category_id": cat_map["lunch"],
                "image_url": "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 40,
                "preparation_time": 8,
                "is_veg": True,
                "rating": 4.6
            },
            {
                "name": "Chicken Noodles",
                "description": "Hakka-style noodles tossed with seasoned shredded chicken, bell peppers, and chili garlic sauce.",
                "price": 80.0,
                "category_id": cat_map["lunch"],
                "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 35,
                "preparation_time": 12,
                "is_veg": False,
                "rating": 4.7
            },
            {
                "name": "Veg Noodles",
                "description": "Stir-fried street-style Hakka noodles with julienned cabbage, capsicum, and soy sauce glaze.",
                "price": 60.0,
                "category_id": cat_map["lunch"],
                "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 30,
                "preparation_time": 10,
                "is_veg": True,
                "rating": 4.5
            },
            {
                "name": "Chicken 65",
                "description": "Crispy, deep-fried spicy South-Indian chicken bites tossed with fresh curry leaves and green chilies.",
                "price": 70.0,
                "category_id": cat_map["snacks"],
                "image_url": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80",
                "availability": "LOW_STOCK",
                "stock_quantity": 6,
                "preparation_time": 12,
                "is_veg": False,
                "rating": 4.9
            },
            {
                "name": "Egg Roll",
                "description": "Golden flaky paratha layered with double egg omelette, chopped onions, and zesty green chutney.",
                "price": 40.0,
                "category_id": cat_map["snacks"],
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 25,
                "preparation_time": 7,
                "is_veg": False,
                "rating": 4.5
            },
            {
                "name": "Veg Sandwich",
                "description": "Fresh toasted multi-layer bread stuffed with cucumber, tomato, potato masala, and mint spread.",
                "price": 40.0,
                "category_id": cat_map["breakfast"],
                "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 20,
                "preparation_time": 6,
                "is_veg": True,
                "rating": 4.4
            },
            {
                "name": "Samosa",
                "description": "Iconic campus triangle pastry stuffed with spiced potatoes and peas, served piping hot with chutney.",
                "price": 15.0,
                "category_id": cat_map["snacks"],
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 50,
                "preparation_time": 2,
                "is_veg": True,
                "rating": 4.8
            },
            {
                "name": "Masala Tea",
                "description": "Cardamom & ginger brewed hot milk chai. The ultimate engineering study session fuel.",
                "price": 10.0,
                "category_id": cat_map["beverages"],
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 80,
                "preparation_time": 3,
                "is_veg": True,
                "rating": 4.9
            },
            {
                "name": "Filter Coffee",
                "description": "Rich, frothy decoction South Indian filter coffee served steaming hot.",
                "price": 15.0,
                "category_id": cat_map["beverages"],
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 60,
                "preparation_time": 3,
                "is_veg": True,
                "rating": 4.8
            },
            {
                "name": "Fresh Lime Soda",
                "description": "Freshly squeezed lemon with fizzing sparkling soda, rock salt, and sweet mint.",
                "price": 25.0,
                "category_id": cat_map["beverages"],
                "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 40,
                "preparation_time": 4,
                "is_veg": True,
                "rating": 4.7
            },
            {
                "name": "Mineral Water (1L)",
                "description": "Chilled packaged pure drinking mineral water.",
                "price": 20.0,
                "category_id": cat_map["beverages"],
                "image_url": "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 100,
                "preparation_time": 1,
                "is_veg": True,
                "rating": 5.0
            },
            {
                "name": "Campus Rush Combo",
                "description": "Chicken Fried Rice + Chicken 65 + Fresh Lime Soda at an exclusive student meal deal.",
                "price": 160.0,
                "category_id": cat_map["combos"],
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 20,
                "preparation_time": 12,
                "is_veg": False,
                "rating": 4.9
            },
            {
                "name": "Study Snack Combo",
                "description": "2 Samosas + 1 Hot Masala Tea. Perfect break-time refreshment.",
                "price": 35.0,
                "category_id": cat_map["combos"],
                "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
                "availability": "AVAILABLE",
                "stock_quantity": 30,
                "preparation_time": 4,
                "is_veg": True,
                "rating": 4.8
            }
        ]

        food_map = {}
        for fi in food_items_data:
            item = FoodItem(**fi)
            db.add(item)
            db.flush()
            food_map[item.name] = item

        # 3. Users
        student_user = User(
            name="Rahul Sharma",
            email="student@campus.edu",
            phone="+91 98765 43210",
            student_id="CS-2023-042",
            role="STUDENT",
            department="Computer Science & Engineering",
            year="3rd Year",
            hashed_password=hash_password("student123")
        )
        db.add(student_user)

        staff_user = User(
            name="Anand Kumar",
            email="staff@chatspot.canteen",
            phone="+91 98450 11223",
            student_id="STAFF-KITCHEN-1",
            role="STAFF",
            department="ChatSpot Central Canteen Kitchen",
            year="Staff",
            hashed_password=hash_password("staff123")
        )
        db.add(staff_user)

        admin_user = User(
            name="Campus Canteen Admin",
            email="admin@chatspot.canteen",
            phone="+91 98450 00001",
            student_id="ADMIN-01",
            role="ADMIN",
            department="Campus Food & Hospitality Committee",
            year="Management",
            hashed_password=hash_password("admin123")
        )
        db.add(admin_user)
        db.flush()

        # 4. Realistic Demo Orders across states
        # Order 1: CS1024 - Token A127 (PREPARING) for student
        now = datetime.datetime.utcnow()
        o1 = Order(
            order_number="CS1024",
            token_number="A127",
            user_id=student_user.id,
            status="PREPARING",
            payment_status="SUCCESSFUL",
            subtotal=105.0,
            total_amount=105.0,
            pickup_counter="Counter 1",
            estimated_ready_time=(datetime.datetime.now() + datetime.timedelta(minutes=6)).strftime("%I:%M %p"),
            estimated_minutes=11,
            created_at=now - datetime.timedelta(minutes=5)
        )
        db.add(o1)
        db.flush()
        db.add(OrderItem(order_id=o1.id, food_item_id=food_map["Chicken Fried Rice"].id, item_name="Chicken Fried Rice", quantity=1, price=80.0))
        db.add(OrderItem(order_id=o1.id, food_item_id=food_map["Fresh Lime Soda"].id, item_name="Fresh Lime Soda", quantity=1, price=25.0))
        db.add(Payment(order_id=o1.id, payment_reference="PAY-CS1024-UPI-884", amount=105.0, status="SUCCESSFUL", payment_method="UPI"))
        db.add(Notification(user_id=student_user.id, order_id=o1.id, title="Food is Cooking! 🔥", message="Your order #CS1024 (Token A127) is currently on the flame.", is_read=False))

        # Order 2: CS1023 - Token A126 (READY)
        o2 = Order(
            order_number="CS1023",
            token_number="A126",
            user_id=student_user.id,
            status="READY",
            payment_status="SUCCESSFUL",
            subtotal=90.0,
            total_amount=90.0,
            pickup_counter="Counter 2",
            estimated_ready_time=(datetime.datetime.now() - datetime.timedelta(minutes=2)).strftime("%I:%M %p"),
            estimated_minutes=8,
            created_at=now - datetime.timedelta(minutes=14)
        )
        db.add(o2)
        db.flush()
        db.add(OrderItem(order_id=o2.id, food_item_id=food_map["Veg Fried Rice"].id, item_name="Veg Fried Rice", quantity=1, price=60.0))
        db.add(OrderItem(order_id=o2.id, food_item_id=food_map["Samosa"].id, item_name="Samosa", quantity=2, price=15.0))
        db.add(Payment(order_id=o2.id, payment_reference="PAY-CS1023-UPI-771", amount=90.0, status="SUCCESSFUL", payment_method="UPI"))
        db.add(Notification(user_id=student_user.id, order_id=o2.id, title="🔔 Order Ready for Pickup!", message="Your order #CS1023 is READY at Counter 2! Token: A126. Please collect now.", is_read=False))

        # Order 3: CS1025 - Token A128 (NEW)
        o3 = Order(
            order_number="CS1025",
            token_number="A128",
            user_id=student_user.id,
            status="NEW",
            payment_status="SUCCESSFUL",
            subtotal=110.0,
            total_amount=110.0,
            pickup_counter="Counter 1",
            estimated_ready_time=(datetime.datetime.now() + datetime.timedelta(minutes=14)).strftime("%I:%M %p"),
            estimated_minutes=14,
            created_at=now - datetime.timedelta(minutes=2)
        )
        db.add(o3)
        db.flush()
        db.add(OrderItem(order_id=o3.id, food_item_id=food_map["Chicken 65"].id, item_name="Chicken 65", quantity=1, price=70.0))
        db.add(OrderItem(order_id=o3.id, food_item_id=food_map["Egg Roll"].id, item_name="Egg Roll", quantity=1, price=40.0))
        db.add(Payment(order_id=o3.id, payment_reference="PAY-CS1025-UPI-992", amount=110.0, status="SUCCESSFUL", payment_method="UPI"))

        # Order 4: CS1022 - Token A125 (ACCEPTED)
        o4 = Order(
            order_number="CS1022",
            token_number="A125",
            user_id=student_user.id,
            status="ACCEPTED",
            payment_status="SUCCESSFUL",
            subtotal=190.0,
            total_amount=190.0,
            pickup_counter="Counter 1",
            estimated_ready_time=(datetime.datetime.now() + datetime.timedelta(minutes=9)).strftime("%I:%M %p"),
            estimated_minutes=12,
            created_at=now - datetime.timedelta(minutes=8)
        )
        db.add(o4)
        db.flush()
        db.add(OrderItem(order_id=o4.id, food_item_id=food_map["Chicken Noodles"].id, item_name="Chicken Noodles", quantity=2, price=80.0))
        db.add(OrderItem(order_id=o4.id, food_item_id=food_map["Filter Coffee"].id, item_name="Filter Coffee", quantity=2, price=15.0))
        db.add(Payment(order_id=o4.id, payment_reference="PAY-CS1022-UPI-612", amount=190.0, status="SUCCESSFUL", payment_method="CAMPUS_WALLET"))

        # Order 5: CS1021 - Token A124 (COMPLETED)
        o5 = Order(
            order_number="CS1021",
            token_number="A124",
            user_id=student_user.id,
            status="COMPLETED",
            payment_status="SUCCESSFUL",
            subtotal=50.0,
            total_amount=50.0,
            pickup_counter="Counter 1",
            estimated_ready_time="11:45 AM",
            estimated_minutes=8,
            created_at=now - datetime.timedelta(hours=2)
        )
        db.add(o5)
        db.flush()
        db.add(OrderItem(order_id=o5.id, food_item_id=food_map["Veg Sandwich"].id, item_name="Veg Sandwich", quantity=1, price=40.0))
        db.add(OrderItem(order_id=o5.id, food_item_id=food_map["Masala Tea"].id, item_name="Masala Tea", quantity=1, price=10.0))
        db.add(Payment(order_id=o5.id, payment_reference="PAY-CS1021-UPI-110", amount=50.0, status="SUCCESSFUL", payment_method="UPI"))

        db.commit()
        print("Database seeded successfully with all college canteen items, demo users, and orders!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
