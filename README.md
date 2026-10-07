# ChatSpot — Smart College Canteen Ordering System

> **“Order Smart. Skip the Crowd.”**  
> *Your campus food, without the queue.*

ChatSpot is a digital college canteen ordering and queue-management platform engineered to eliminate crowded break-time lines, reduce student waiting times, and streamline kitchen order operations.

---

## 🌟 Key Features

### For Students
- **Zero Queue Ordering**: Browse today's live canteen menu, select food items, customize quantities, and order from anywhere on campus.
- **Dynamic Estimated Prep Time**: Intelligent algorithm calculates realistic preparation times based on selected items and active kitchen queue workload.
- **Realistic Payment State Machine**: Simulated Razorpay / UPI flow with state transitions (`Pending` → `Processing` → `Successful` / `Failed`).
- **High-Visibility Token Generation**: Generates unique alphanumeric token numbers (e.g. `A127`) and order IDs (`CS1024`) for fast 30-second counter pickups.
- **Live Order Timeline**: Real-time multi-stage status tracker (`Order Placed` → `Payment Confirmed` → `Order Received` → `Preparing Your Food` → `Ready for Pickup` → `Completed`).
- **Audio & Visual Alerts**: Celebratory in-app toast notification with sound chime when an order is marked `READY`.
- **Order History & 1-Click Reorder**: Rapid re-ordering of favorite campus meals.
- **Live Canteen Load Badge**: Real-time indicator (`🟢 Low Crowd` / `🟡 Moderate` / `🔴 High`) informing students about current kitchen wait times.

### For Canteen Staff & Admins
- **Interactive Kanban Kitchen Board**: 5-column live workflow (`NEW` → `ACCEPTED` → `PREPARING` → `READY` → `COMPLETED`) with one-click status transitions that instantly notify students.
- **Live KPI Counter**: Today's orders count, pending queues, meals currently cooking, ready pickups, and real-time revenue tallies.
- **Menu Management Console**: Add, edit, delete dishes, update prices, adjust prep times, and toggle instant stock availability (`Available`, `Low Stock`, `Sold Out`).
- **Sales & Crowd Analytics**: Peak ordering rush hour insights (`12:00 PM – 1:30 PM`), hourly volume charts, top-selling dishes, and average prep time metrics.

---

## 🏗️ Architecture & Tech Stack

```
ChatSpot/
├── frontend/                     # React.js + Vite + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── api/client.js         # API integration with JWT bearer auth
│   │   ├── context/              # AuthContext, CartContext, NotificationContext
│   │   ├── components/           # Navbar, FoodCard, CartDrawer, LiveCrowdBadge, DemoBanner, Footer
│   │   ├── pages/                # Home, Menu, Checkout, OrderTracking, OrderHistory, Profile, StaffDashboard, Login
│   │   ├── index.css             # Tailwind design tokens & subtle animations
│   │   └── App.jsx               # Routes and notification banners
│   └── vite.config.js            # Reverse proxy configuration to backend (/api -> :8000)
│
└── backend/                      # FastAPI + SQLAlchemy 2.0 + Pydantic v2
    ├── app/
    │   ├── main.py               # Application entrypoint & CORS middleware
    │   ├── core/                 # Config, JWT security, SQLAlchemy database session
    │   ├── models/               # Relational models (users, categories, food_items, orders, order_items, payments, notifications)
    │   ├── schemas/              # Pydantic validation schemas
    │   ├── api/                  # Endpoints (auth, menu, orders, payments, notifications, staff, canteen, analytics)
    │   └── services/             # Queue delay calculator, live crowd service, payment verification abstraction
    └── seed.py                   # Pre-populates database with official college menu, demo orders, and accounts
```

---

## ⚡ Quick Start

### 1. Backend (FastAPI)
```bash
cd backend

# (Optional) Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed realistic college canteen data (menu, users, orders)
python3 seed.py

# Run FastAPI backend server
python3 -m uvicorn app.main:app --port 8000 --reload
```
API Documentation is available at: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 🔑 Demo Personas & Pre-Seeded Accounts

The application includes a **Quick Switch Persona** banner at the top of the screen to switch between test roles in one click:

| Role | Email | Password | Pre-seeded Permissions |
|---|---|---|---|
| 🎓 **Student** (Rahul Sharma) | `student@campus.edu` | `student123` | Browse menu, cart tray, pay, live track orders |
| 👨‍🍳 **Canteen Staff** (Anand Kumar) | `staff@chatspot.canteen` | `staff123` | Live Kitchen Kanban, order status updates, menu editing |
| 📊 **Admin** | `admin@chatspot.canteen` | `admin123` | Kitchen board, menu management, sales & analytics |

### Pre-Seeded Demo Orders to Track:
- **`A127`** (Order `#CS1024`): Currently **`PREPARING`** (Chicken Fried Rice + Fresh Lime Soda)
- **`A126`** (Order `#CS1023`): Currently **`READY`** for pickup (Shows celebration banner)
- **`A125`** (Order `#CS1022`): Currently **`ACCEPTED`** by canteen
- **`A128`** (Order `#CS1025`): Currently **`NEW`** order waiting to be accepted
- **`A124`** (Order `#CS1021`): **`COMPLETED`** meal
