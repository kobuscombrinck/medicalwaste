const express = require('express');
const router = express.Router();
const { Delivery, Customer, Vehicle, Driver, Location } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all deliveries with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      status,
      type,
      customerId,
      vehicleId,
      driverId,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (customerId) where.customerId = customerId;
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;
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
        { model: Driver },
        { model: Location }
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['scheduledDate', 'ASC'], ['sequence', 'ASC']]
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

// Get driver's deliveries for the day
router.get('/driver/today', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deliveries = await Delivery.findAll({
      where: {
        driverId: req.user.Driver.id,
        scheduledDate: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      include: [
        { model: Customer },
        { model: Location },
        { model: Vehicle }
      ],
      order: [['sequence', 'ASC']]
    });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new delivery
router.post('/', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const {
      customerId,
      type,
      scheduledDate,
      vehicleId,
      driverId,
      sequence,
      notes
    } = req.body;

    const delivery = await Delivery.create({
      customerId,
      type,
      scheduledDate,
      vehicleId,
      driverId,
      sequence,
      notes,
      status: 'pending'
    });

    const fullDelivery = await Delivery.findByPk(delivery.id, {
      include: [
        { model: Customer },
        { model: Vehicle },
        { model: Driver },
        { model: Location }
      ]
    });

    res.status(201).json(fullDelivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update delivery status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, completedDate } = req.body;
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    await delivery.update({
      status,
      completedDate: status === 'completed' ? completedDate || new Date() : null
    });

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update delivery sequence
router.patch('/sequence', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const { deliveries } = req.body; // Array of { id, sequence }

    // Update sequences in transaction
    await sequelize.transaction(async (t) => {
      for (const delivery of deliveries) {
        await Delivery.update(
          { sequence: delivery.sequence },
          { where: { id: delivery.id }, transaction: t }
        );
      }
    });

    res.json({ message: 'Sequences updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate manifest
router.get('/:id/manifest', authenticate, async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: Vehicle },
        { model: Driver },
        { model: Location },
        { 
          model: ContainerHistory,
          include: [{ model: Container }]
        }
      ]
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // TODO: Generate PDF manifest
    // This will be implemented in a separate service

    res.json({ message: 'Manifest generated', delivery });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
