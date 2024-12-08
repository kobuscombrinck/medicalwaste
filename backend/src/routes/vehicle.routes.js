const express = require('express');
const router = express.Router();
const { Vehicle, Driver, VehicleInspection, Incident } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all vehicles with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      status,
      type,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where[Op.or] = [
        { registrationNumber: { [Op.iLike]: `%${search}%` } },
        { fleetNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const vehicles = await Vehicle.findAndCountAll({
      where,
      include: [{ 
        model: Driver,
        include: ['User']
      }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      vehicles: vehicles.rows,
      total: vehicles.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(vehicles.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vehicle by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [
        { 
          model: Driver,
          include: ['User']
        },
        {
          model: VehicleInspection,
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new vehicle
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      registrationNumber,
      fleetNumber,
      type,
      size,
      color,
      currentDriverId
    } = req.body;

    // Check if registration number exists
    const existing = await Vehicle.findOne({
      where: { registrationNumber }
    });

    if (existing) {
      return res.status(400).json({ message: 'Registration number already exists' });
    }

    const vehicle = await Vehicle.create({
      registrationNumber,
      fleetNumber,
      type,
      size,
      color,
      currentDriverId,
      status: 'active'
    });

    const newVehicle = await Vehicle.findByPk(vehicle.id, {
      include: [{ 
        model: Driver,
        include: ['User']
      }]
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update vehicle
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const {
      type,
      size,
      color,
      currentDriverId,
      status
    } = req.body;

    await vehicle.update({
      type,
      size,
      color,
      currentDriverId,
      status
    });

    const updatedVehicle = await Vehicle.findByPk(vehicle.id, {
      include: [{ 
        model: Driver,
        include: ['User']
      }]
    });

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Record vehicle inspection
router.post('/:id/inspection', authenticate, async (req, res) => {
  try {
    const {
      type,
      odometerReading,
      fuelLevel,
      checkList,
      issues,
      notes,
      images,
      status
    } = req.body;

    const inspection = await VehicleInspection.create({
      vehicleId: req.params.id,
      driverId: req.user.Driver.id,
      type,
      odometerReading,
      fuelLevel,
      checkList,
      issues,
      notes,
      images,
      status
    });

    res.status(201).json(inspection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vehicle inspections
router.get('/:id/inspections', authenticate, async (req, res) => {
  try {
    const {
      type,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const where = { vehicleId: req.params.id };
    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.inspectionDate = {};
      if (startDate) where.inspectionDate[Op.gte] = new Date(startDate);
      if (endDate) where.inspectionDate[Op.lte] = new Date(endDate);
    }

    const inspections = await VehicleInspection.findAndCountAll({
      where,
      include: [{ 
        model: Driver,
        include: ['User']
      }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['inspectionDate', 'DESC']]
    });

    res.json({
      inspections: inspections.rows,
      total: inspections.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(inspections.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vehicle incidents
router.get('/:id/incidents', authenticate, async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      where: { vehicleId: req.params.id },
      include: [{ 
        model: Driver,
        include: ['User']
      }],
      order: [['date', 'DESC']]
    });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
