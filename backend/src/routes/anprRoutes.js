const express = require('express');
const router = express.Router();
const { simulateANPREntry, simulateANPRExit } = require('../controllers/anprController');

router.post('/entry', simulateANPREntry);
router.post('/exit', simulateANPRExit);

module.exports = router;
