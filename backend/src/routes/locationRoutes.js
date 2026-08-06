const express = require('express');
const router = express.Router();
const { getLocations, getLocationBySlug, getAIRecommendation } = require('../controllers/locationController');

router.get('/', getLocations);
router.get('/:slug', getLocationBySlug);
router.get('/:locationId/ai-recommend', getAIRecommendation);

module.exports = router;
