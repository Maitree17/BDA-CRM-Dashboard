const express = require('express');
const { getTeamPerformance } = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/performance', getTeamPerformance);

module.exports = router;
