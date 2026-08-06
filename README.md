# ParkSmart AI - Enterprise Smart Parking Management Platform

ParkSmart AI is a production-ready, enterprise-grade Smart Parking Platform engineered for Malls, Hospitals, Airports, IT Tech Parks, Corporate Hubs, and Smart Cities. It combines real-time Socket.IO slot synchronization, visual floor plan maps with compulsory slot selection, AI slot recommendation algorithms, ANPR barrier gate simulation, indoor pathfinding, EV fast-charging hub metrics, valet management, and private parking spot marketplace.

---

## 🌟 Key Platform Features

- **Malls & Hospitals Interactive Map & Compulsory Slot Booking**:
  - Browse Phoenix Marketcity Mall, Select CITYWALK, Apollo Super Speciality Hospital, Fortis Healthcare, and DLF Cyber Hub IT Park.
  - Interactive Leaflet map with custom category pins and dynamic available slot indicators.
  - **15-Minute Reservation Hold & Visual Multi-Floor Grid Map**: Visual floor plan (Basement 1, Basement 2, OPD Wing) with compulsory slot pick.
- **AI Slot Recommender System**:
  - Recommends the optimal slot based on vehicle type (EV vs Gas), elevator distance, accessibility requirements, and floor occupancy.
- **ANPR (Automatic Number Plate Recognition) Barrier Simulation**:
  - Live gate scanner laser graphic, automated barrier arm lift, instant plate recognition, entry/exit verification, and automatic digital receipt invoice generation.
- **Indoor Pathfinding & "Find My Vehicle"**:
  - Interactive SVG map rendering route from Entrance -> Elevator -> Booked Slot.
- **Multi-Role Dashboards**:
  - **Customer**: Active booking hold timer, QR gate pass, saved vehicle manager, payment history.
  - **Parking Operator / Mall Owner**: Real-time floor occupancy telemetry, revenue counters, and ANPR gate stream log.
  - **Valet Staff**: Key tag assignment and vehicle drop-off/retrieval pipeline.
  - **Administrator**: System analytics, revenue growth charts, and yield predictions.
- **ParkBot AI Chatbot & SOS Emergency**:
  - Floating AI assistant for instant slot queries and emergency security triggers.
- **Peer-to-Peer Parking Marketplace**:
  - Rent out private driveways and commercial parking spots.

---

## 📁 System Folder Structure

```
ParkSmart-AI/
├── frontend/                     # React + Vite Client Application
│   ├── src/
│   │   ├── components/           # Navbar, Footer, InteractiveMap, CompulsorySlotGrid, ANPRBarrierSimulator, IndoorPathMap, AIChatBot
│   │   ├── pages/                # LandingPage, SearchLocations, SlotBookingPage, CustomerDashboard, OperatorDashboard, ValetPage, MarketplacePage, AdminDashboard
│   │   ├── services/             # Axios API client & Socket.IO instance
│   │   ├── store/                # Zustand state management (useAuthStore, useParkingStore, useThemeStore)
│   │   ├── routes/
│   │   ├── index.css             # Tailwind CSS & Glassmorphism theme
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
├── backend/                      # Node.js + Express REST API & Socket.IO Server
│   ├── prisma/                   # Prisma Schema & Database Seeder
│   ├── src/
│   │   ├── config/               # Database & Prisma client setup
│   │   ├── controllers/          # Auth, Location, Reservation, ANPR, Valet, Marketplace, Analytics
│   │   ├── middleware/           # JWT auth & role authorization
│   │   ├── routes/               # Modular Express REST endpoints
│   │   ├── services/             # AI Slot Recommender & ANPR Simulator logic
│   │   ├── sockets/              # Socket.IO handlers for real-time slot sync
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
└── README.md                     # Root project documentation
```

---

## 🚀 Quick Start Guide

### 1. Backend Server Setup
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Backend server runs at `http://localhost:5001`.*

### 2. Frontend Client Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend application runs at `http://localhost:5173`.*

---

## 🔐 Demo User Accounts & Roles

Switch active roles instantly using the Top Navigation bar role switcher:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@parksmart.ai` | `password123` |
| **Customer** | `user@parksmart.ai` | `password123` |
| **Operator / Mall Owner** | `operator@parksmart.ai` | `password123` |
| **Valet Lead** | `valet@parksmart.ai` | `password123` |
