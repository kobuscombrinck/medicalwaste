const express = require('express');
const router = express.Router();
const { Driver, User, Vehicle, Delivery, Incident } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Get all drivers with filters
router.get('/', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { licenseNumber: { [Op.iLike]: `%${search}%` } },
        { '$User.firstName$': { [Op.iLike]: `%${search}%` } },
        { '$User.lastName$': { [Op.iLike]: `%${search}%` } },
        { '$User.email$': { [Op.iLike]: `%${search}%` } }
      ];
    }

    const drivers = await Driver.findAndCountAll({
      where,
      include: [
        { model: User },
        { model: Vehicle }
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[{ model: User }, 'firstName', 'ASC']]
    });

    res.json({
      drivers: drivers.rows,
      total: drivers.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(drivers.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get driver by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: Vehicle },
        {
          model: Delivery,
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new driver
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      licenseExpiry,
      emergencyContact,
      emergencyPhone
    } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user and driver in transaction
    const result = await sequelize.transaction(async (t) => {
      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: 'driver'
      }, { transaction: t });

      const driver = await Driver.create({
        userId: user.id,
        licenseNumber,
        licenseExpiry,
        emergencyContact,
        emergencyPhone,
        status: 'active'
      }, { transaction: t });

      return { user, driver };
    });

    // TODO: Send email with temporary password

    const newDriver = await Driver.findByPk(result.driver.id, {
      include: [{ model: User }]
    });

    res.status(201).json({
      driver: newDriver,
      tempPassword // Only send in development
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update driver
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: User }]
    });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const {
      firstName,
      lastName,
      phone,
      licenseNumber,
      licenseExpiry,
      emergencyContact,
      emergencyPhone,
      status
    } = req.body;

    await sequelize.transaction(async (t) => {
      await driver.User.update({
        firstName,
        lastName,
        phone
      }, { transaction: t });

      await driver.update({
        licenseNumber,
        licenseExpiry,
        emergencyContact,
        emergencyPhone,
        status
      }, { transaction: t });
    });

    const updatedDriver = await Driver.findByPk(driver.id, {
      include: [{ model: User }]
    });

    res.json(updatedDriver);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get driver's deliveries
router.get('/:id/deliveries', authenticate, async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const where = { driverId: req.params.id };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate[Op.gte] = new Date(startDate);
      if (endDate) where.scheduledDate[Op.lte] = new Date(endDate);
    }

    const deliveries = await Delivery.findAndCountAll({
      where,
      include: [
        { model: Customer },
        { model: Location },
        { model: Vehicle }
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['scheduledDate', 'DESC']]
    });

    res.json({
      deliveries: deliveries.rows,
      total: deliveries.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(deliveries.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get driver's incidents
router.get('/:id/incidents', authenticate, async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      where: { driverId: req.params.id },
      include: [{ model: Vehicle }],
      order: [['date', 'DESC']]
    });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
