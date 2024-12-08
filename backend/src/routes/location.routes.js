const express = require('express');
const router = express.Router();
const { Location, Customer, Delivery } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get locations by customer
router.get('/customer/:customerId', authenticate, async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { 
        customerId: req.params.customerId,
        isActive: true
      },
      order: [['name', 'ASC']]
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single location
router.get('/:id', authenticate, async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id, {
      include: [{ model: Customer }]
    });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new location
router.post('/', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const {
      customerId,
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      contactPerson,
      contactPhone,
      accessInstructions
    } = req.body;

    const location = await Location.create({
      customerId,
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      contactPerson,
      contactPhone,
      accessInstructions
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update location
router.put('/:id', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const {
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      contactPerson,
      contactPhone,
      accessInstructions,
      isActive
    } = req.body;

    await location.update({
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      contactPerson,
      contactPhone,
      accessInstructions,
      isActive
    });

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get location delivery history
router.get('/:id/deliveries', authenticate, async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const where = { locationId: req.params.id };
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
        { model: Vehicle },
        { model: Driver }
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

// Deactivate location
router.patch('/:id/deactivate', authenticate, authorize('admin'), async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await location.update({ isActive: false });
    res.json({ message: 'Location deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
