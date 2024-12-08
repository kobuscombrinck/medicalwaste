const express = require('express');
const router = express.Router();
const { Container, ContainerHistory, Customer } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all containers with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      type,
      status,
      customerId,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (customerId) where.currentCustomerId = customerId;

    const containers = await Container.findAndCountAll({
      where,
      include: [{ model: Customer }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      containers: containers.rows,
      total: containers.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(containers.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get container by barcode
router.get('/barcode/:barcode', authenticate, async (req, res) => {
  try {
    const container = await Container.findOne({
      where: { barcode: req.params.barcode },
      include: [{ model: Customer }]
    });

    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    res.json(container);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new container
router.post('/', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const { barcode, type } = req.body;

    // Check if barcode exists
    const existing = await Container.findOne({ where: { barcode } });
    if (existing) {
      return res.status(400).json({ message: 'Barcode already exists' });
    }

    const container = await Container.create({
      barcode,
      type,
      status: 'available'
    });

    res.status(201).json(container);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update container status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const container = await Container.findByPk(req.params.id);

    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    await container.update({ status });
    res.json(container);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get container history
router.get('/:id/history', authenticate, async (req, res) => {
  try {
    const history = await ContainerHistory.findAll({
      where: { containerId: req.params.id },
      include: [{ model: Customer }],
      order: [['createdAt', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Record container action (delivery, collection, cleaning, disposal)
router.post('/:id/action', authenticate, async (req, res) => {
  try {
    const {
      action,
      deliveryId,
      customerId,
      weight,
      wasteType,
      notes,
      location
    } = req.body;

    const container = await Container.findByPk(req.params.id);
    if (!container) {
      return res.status(404).json({ message: 'Container not found' });
    }

    // Create history record
    const history = await ContainerHistory.create({
      containerId: container.id,
      deliveryId,
      customerId,
      action,
      weight,
      wasteType,
      notes,
      scannedLocation: location,
      scannedBy: req.user.id
    });

    // Update container status based on action
    let status;
    switch (action) {
      case 'delivered':
        status = 'in_use';
        break;
      case 'collected':
        status = 'in_transit';
        break;
      case 'cleaned':
        status = 'available';
        break;
      case 'disposed':
        status = 'disposed';
        break;
    }

    await container.update({
      status,
      currentCustomerId: action === 'delivered' ? customerId : null,
      lastUsedDate: action === 'collected' ? new Date() : container.lastUsedDate,
      lastCleanedDate: action === 'cleaned' ? new Date() : container.lastCleanedDate
    });

    res.status(201).json({ history, container });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
