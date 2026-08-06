const express = require('express');
const router = express.Router();
const { requestValet, getValetTickets, updateValetStatus } = require('../controllers/valetController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, requestValet);
router.get('/', protect, getValetTickets);
router.patch('/:ticketId/status', protect, updateValetStatus);

module.exports = router;
