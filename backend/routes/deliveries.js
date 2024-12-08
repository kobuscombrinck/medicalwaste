const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const DeliveryController = require('../controllers/deliveryController');
const { validateDelivery } = require('../middleware/validation');

// Get all deliveries with filtering and pagination
router.get('/', auth, DeliveryController.getDeliveries);

// Get a specific delivery
router.get('/:id', auth, DeliveryController.getDeliveryById);

// Create a new delivery
router.post('/', 
  auth, 
  checkRole(['admin', 'manager', 'dispatcher']), 
  validateDelivery,
  DeliveryController.createDelivery
);

// Update a delivery
router.put('/:id', 
  auth, 
  checkRole(['admin', 'manager', 'dispatcher']), 
  validateDelivery,
  DeliveryController.updateDelivery
);

// Delete a delivery
router.delete('/:id', 
  auth, 
  checkRole(['admin', 'manager']), 
  DeliveryController.deleteDelivery
);

// Update delivery status
router.patch('/:id/status', 
  auth, 
  checkRole(['admin', 'manager', 'dispatcher', 'driver']), 
  DeliveryController.updateDeliveryStatus
);

// Assign driver to delivery
router.post('/:id/assign-driver', 
  auth, 
  checkRole(['admin', 'manager', 'dispatcher']), 
  DeliveryController.assignDriver
);

// Generate delivery manifest
router.get('/:id/manifest', 
  auth, 
  DeliveryController.generateManifest
);

module.exports = router;
