const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const anprRoutes = require('./routes/anprRoutes');
const valetRoutes = require('./routes/valetRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const initSocketIO = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Attach io instance to req for controllers to emit
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Initialize Socket.IO
initSocketIO(io);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ParkSmart AI Backend Engine',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/anpr', anprRoutes);
app.use('/api/valet', valetRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  🚀 ====================================================
  🚗 ParkSmart AI Backend Engine Running on Port ${PORT}
  📍 Health check: http://localhost:${PORT}/api/health
  ⚡ Real-Time Socket.IO Listener Active
  ==================================================== 🚀
  `);
});
