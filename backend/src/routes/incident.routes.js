const express = require('express');
const router = express.Router();
const { Incident, Vehicle, Driver, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

// Get all incidents with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      type,
      severity,
      status,
      startDate,
      endDate,
      vehicleId,
      driverId,
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (type) where.type = type;
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const incidents = await Incident.findAndCountAll({
      where,
      include: [
        { 
          model: Driver,
          include: [{ model: User }]
        },
        { model: Vehicle }
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['date', 'DESC']]
    });

    res.json({
      incidents: incidents.rows,
      total: incidents.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(incidents.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get incident by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id, {
      include: [
        { 
          model: Driver,
          include: [{ model: User }]
        },
        { model: Vehicle }
      ]
    });

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Report new incident
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      type,
      severity,
      date,
      location,
      description,
      vehicleId,
      images,
      witnesses,
      policeReport,
      insuranceClaim
    } = req.body;

    const incident = await Incident.create({
      type,
      severity,
      date,
      location,
      description,
      vehicleId,
      driverId: req.user.Driver.id,
      images,
      witnesses,
      policeReport,
      insuranceClaim,
      status: 'reported'
    });

    const newIncident = await Incident.findByPk(incident.id, {
      include: [
        { 
          model: Driver,
          include: [{ model: User }]
        },
        { model: Vehicle }
      ]
    });

    // TODO: Send notification to supervisors

    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update incident
router.put('/:id', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const {
      type,
      severity,
      date,
      location,
      description,
      images,
      witnesses,
      policeReport,
      insuranceClaim,
      status,
      resolution,
      resolutionDate
    } = req.body;

    await incident.update({
      type,
      severity,
      date,
      location,
      description,
      images,
      witnesses,
      policeReport,
      insuranceClaim,
      status,
      resolution,
      resolutionDate
    });

    const updatedIncident = await Incident.findByPk(incident.id, {
      include: [
        { 
          model: Driver,
          include: [{ model: User }]
        },
        { model: Vehicle }
      ]
    });

    res.json(updatedIncident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add comment to incident
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    const { comment } = req.body;
    
    const comments = incident.comments || [];
    comments.push({
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      comment,
      timestamp: new Date()
    });

    await incident.update({ comments });

    res.json({ message: 'Comment added successfully', comments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get incident statistics
router.get('/stats/summary', authenticate, authorize('admin', 'supervisor'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const [totalIncidents, byType, bySeverity, byStatus, byVehicle] = await Promise.all([
      Incident.count({ where }),
      Incident.count({ 
        where,
        group: ['type']
      }),
      Incident.count({
        where,
        group: ['severity']
      }),
      Incident.count({
        where,
        group: ['status']
      }),
      Incident.count({
        where,
        group: ['vehicleId'],
        include: [{ model: Vehicle, attributes: ['registrationNumber'] }]
      })
    ]);

    res.json({
      totalIncidents,
      byType,
      bySeverity,
      byStatus,
      byVehicle
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
