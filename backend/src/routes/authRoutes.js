const express = require('express');
const router = express.Router();
const { register, login, getMe, googleLoginSim, addVehicle } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLoginSim);
router.get('/me', protect, getMe);
router.post('/vehicles', protect, addVehicle);

module.exports = router;
