const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/fileUpload');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all vehicles
router.get('/', 
  authorize(['admin', 'manager', 'driver']),
  VehicleController.getVehicles
);

// Get vehicle by ID
router.get('/:id',
  authorize(['admin', 'manager', 'driver']),
  VehicleController.getVehicleById
);

// Create new vehicle
router.post('/',
  authorize(['admin', 'manager']),
  VehicleController.createVehicle
);

// Update vehicle
router.put('/:id',
  authorize(['admin', 'manager']),
  VehicleController.updateVehicle
);

// Delete vehicle
router.delete('/:id',
  authorize(['admin']),
  VehicleController.deleteVehicle
);

// Add incident
router.post('/:id/incidents',
  authorize(['admin', 'manager', 'driver']),
  VehicleController.addIncident
);

// Update incident
router.put('/:id/incidents/:incidentId',
  authorize(['admin', 'manager']),
  VehicleController.updateIncident
);

// Delete incident
router.delete('/:id/incidents/:incidentId',
  authorize(['admin', 'manager']),
  VehicleController.deleteIncident
);

// Add document
router.post('/:id/documents',
  authorize(['admin', 'manager']),
  upload.single('file'),
  VehicleController.addDocument
);

// Delete document
router.delete('/:id/documents/:documentId',
  authorize(['admin', 'manager']),
  VehicleController.deleteDocument
);

// Add maintenance record
router.post('/:id/maintenance',
  authorize(['admin', 'manager']),
  VehicleController.addMaintenance
);

// Get maintenance history
router.get('/:id/maintenance',
  authorize(['admin', 'manager', 'driver']),
  VehicleController.getMaintenanceHistory
);

// Get vehicle statistics
router.get('/:id/stats',
  authorize(['admin', 'manager', 'driver']),
  VehicleController.getVehicleStats
);

module.exports = router;
