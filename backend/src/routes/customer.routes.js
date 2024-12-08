const express = require('express');
const router = express.Router();
const { Customer, Location, Delivery } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all customers with filters
router.get('/', authenticate, async (req, res) => {
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
        { name: { [Op.iLike]: `%${search}%` } },
        { contactPerson: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const customers = await Customer.findAndCountAll({
      where,
      include: [{ model: Location }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['name', 'ASC']]
    });

    res.json({
      customers: customers.rows,
      total: customers.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(customers.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get customer by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [
        { model: Location },
        { 
          model: Delivery,
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new customer
router.post('/', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      whatsapp,
      specialRequirements,
      locations
    } = req.body;

    // Create customer with locations in transaction
    const result = await sequelize.transaction(async (t) => {
      const customer = await Customer.create({
        name,
        contactPerson,
        email,
        phone,
        whatsapp,
        specialRequirements
      }, { transaction: t });

      if (locations && locations.length > 0) {
        await Location.bulkCreate(
          locations.map(loc => ({ ...loc, customerId: customer.id })),
          { transaction: t }
        );
      }

      return customer;
    });

    const newCustomer = await Customer.findByPk(result.id, {
      include: [{ model: Location }]
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update customer
router.put('/:id', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const {
      name,
      contactPerson,
      email,
      phone,
      whatsapp,
      specialRequirements,
      status
    } = req.body;

    await customer.update({
      name,
      contactPerson,
      email,
      phone,
      whatsapp,
      specialRequirements,
      status
    });

    const updatedCustomer = await Customer.findByPk(customer.id, {
      include: [{ model: Location }]
    });

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Archive customer
router.patch('/:id/archive', authenticate, authorize('admin'), async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update({ status: 'archived' });
    res.json({ message: 'Customer archived successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get customer delivery history
router.get('/:id/deliveries', authenticate, async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const where = { customerId: req.params.id };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate[Op.gte] = new Date(startDate);
      if (endDate) where.scheduledDate[Op.lte] = new Date(endDate);
    }

    const deliveries = await Delivery.findAndCountAll({
      where,
      include: [
        { model: Vehicle },
        { model: Driver },
        { model: Location }
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

module.exports = router;
