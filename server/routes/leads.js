const express = require('express');
const { body } = require('express-validator');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getLeads)
  .post(
    [
      body('name', 'Lead name is required').notEmpty(),
      body('company', 'Company name is required').notEmpty(),
      body('email', 'Please include a valid email').isEmail(),
      body('phone', 'Phone number is required').notEmpty(),
      body('industry', 'Industry is required').notEmpty(),
      body('assignedTo', 'Please assign the lead to a user').notEmpty(),
    ],
    createLead
  );

router
  .route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

router.patch('/:id/status', updateLeadStatus);

module.exports = router;
