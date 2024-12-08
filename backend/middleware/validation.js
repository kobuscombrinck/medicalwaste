const { body, validationResult } = require('express-validator');
const { validateObjectId } = require('../utils/validation');

// Validation middleware for delivery requests
const validateDelivery = [
  body('customerId')
    .notEmpty()
    .withMessage('Customer ID is required')
    .custom(value => validateObjectId(value))
    .withMessage('Invalid customer ID'),

  body('scheduledDate')
    .notEmpty()
    .withMessage('Scheduled date is required')
    .isISO8601()
    .withMessage('Invalid date format'),

  body('type')
    .notEmpty()
    .withMessage('Delivery type is required')
    .isIn(['pickup', 'delivery', 'exchange'])
    .withMessage('Invalid delivery type'),

  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority level'),

  body('containers')
    .optional()
    .isArray()
    .withMessage('Containers must be an array')
    .custom(containers => containers.every(id => validateObjectId(id)))
    .withMessage('Invalid container ID(s)'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim(),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateDelivery
};
