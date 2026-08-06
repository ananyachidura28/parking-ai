# ParkSmart AI - Backend REST API & Socket.IO Engine

Node.js Express backend engine powering real-time slot state broadcasts, Prisma ORM database transactions, JWT authentication, ANPR gate barrier simulation, and AI slot recommendation.

---

## 💻 Tech Stack

- **Runtime**: Node.js + Express.js
- **Database ORM**: Prisma ORM (SQLite / PostgreSQL ready)
- **Real-Time Sync**: Socket.IO
- **Security**: JWT Authentication + BcryptJS password hashing
- **API Logger**: Morgan

---

## 🛠️ Installation & Database Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   See `.env`:
   ```env
   PORT=5001
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="parksmart_ai_jwt_super_secret_key_2026"
   ```

3. **Database Migration & Seeding**:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

4. **Start Backend Server**:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints Overview

- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - JWT Login
- `GET /api/locations` - Search Malls & Hospitals with category filter
- `GET /api/locations/:slug` - Get location multi-floor slots
- `POST /api/reservations` - Book Compulsory Slot (triggers Socket broadcast)
- `POST /api/anpr/entry` - ANPR Gate Entry Simulation
- `POST /api/anpr/exit` - ANPR Gate Exit & Digital Receipt
- `GET /api/valet` - Valet Ticket Pipeline
- `GET /api/analytics/dashboard` - Platform Occupancy & Revenue Stats
