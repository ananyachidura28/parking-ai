const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, getActiveReservation, cancelReservation } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReservation);
router.get('/my', protect, getUserReservations);
router.get('/active', protect, getActiveReservation);
router.patch('/:id/cancel', protect, cancelReservation);

module.exports = router;
