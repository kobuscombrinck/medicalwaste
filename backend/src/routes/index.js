const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const locationRoutes = require('./location.routes');
const containerRoutes = require('./container.routes');
const deliveryRoutes = require('./delivery.routes');
const vehicleRoutes = require('./vehicle.routes');
const driverRoutes = require('./driver.routes');
const incidentRoutes = require('./incident.routes');

// Register routes
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/locations', locationRoutes);
router.use('/containers', containerRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/incidents', incidentRoutes);

module.exports = router;
