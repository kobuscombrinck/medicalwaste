const Delivery = require('../models/delivery');
const Customer = require('../models/customer');
const Driver = require('../models/driver');
const Container = require('../models/container');
const PDFDocument = require('pdfkit');
const { validateObjectId } = require('../utils/validation');
const { createError } = require('../utils/error');

class DeliveryController {
  // Get all deliveries with filtering and pagination
  static async getDeliveries(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let query = {};

      // Apply filters
      if (req.query.search) {
        query.$or = [
          { 'customer.name': { $regex: req.query.search, $options: 'i' } },
          { 'driver.name': { $regex: req.query.search, $options: 'i' } }
        ];
      }

      if (req.query.status) {
        query.status = req.query.status;
      }

      if (req.query.date) {
        const startDate = new Date(req.query.date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        query.scheduledDate = { $gte: startDate, $lt: endDate };
      }

      const [deliveries, total] = await Promise.all([
        Delivery.find(query)
          .populate('customer', 'name address')
          .populate('driver', 'name')
          .populate('containers', 'serialNumber type')
          .sort({ scheduledDate: -1 })
          .skip(skip)
          .limit(limit),
        Delivery.countDocuments(query)
      ]);

      res.json({
        deliveries,
        totalCount: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a specific delivery
  static async getDeliveryById(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid delivery ID');
      }

      const delivery = await Delivery.findById(req.params.id)
        .populate('customer', 'name address')
        .populate('driver', 'name')
        .populate('containers', 'serialNumber type status');

      if (!delivery) {
        throw createError(404, 'Delivery not found');
      }

      res.json(delivery);
    } catch (error) {
      next(error);
    }
  }

  // Create a new delivery
  static async createDelivery(req, res, next) {
    try {
      const { customerId, containers, scheduledDate, type, priority, notes } = req.body;

      // Validate customer
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw createError(404, 'Customer not found');
      }

      // Validate containers
      if (containers && containers.length > 0) {
        const containerDocs = await Container.find({ _id: { $in: containers } });
        if (containerDocs.length !== containers.length) {
          throw createError(400, 'One or more containers not found');
        }
      }

      const delivery = new Delivery({
        customer: customerId,
        containers,
        scheduledDate,
        type,
        priority,
        notes,
        status: 'scheduled',
        statusHistory: [{
          status: 'scheduled',
          timestamp: new Date(),
          updatedBy: req.user._id
        }]
      });

      await delivery.save();
      await delivery.populate('customer', 'name address');
      await delivery.populate('containers', 'serialNumber type');

      res.status(201).json(delivery);
    } catch (error) {
      next(error);
    }
  }

  // Update a delivery
  static async updateDelivery(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid delivery ID');
      }

      const delivery = await Delivery.findById(req.params.id);
      if (!delivery) {
        throw createError(404, 'Delivery not found');
      }

      // Don't allow updates if delivery is completed or cancelled
      if (['completed', 'cancelled'].includes(delivery.status)) {
        throw createError(400, 'Cannot update completed or cancelled deliveries');
      }

      const updates = req.body;
      
      // If updating customer, validate
      if (updates.customerId) {
        const customer = await Customer.findById(updates.customerId);
        if (!customer) {
          throw createError(404, 'Customer not found');
        }
        updates.customer = updates.customerId;
        delete updates.customerId;
      }

      // If updating containers, validate
      if (updates.containers) {
        const containerDocs = await Container.find({ _id: { $in: updates.containers } });
        if (containerDocs.length !== updates.containers.length) {
          throw createError(400, 'One or more containers not found');
        }
      }

      const updatedDelivery = await Delivery.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      )
        .populate('customer', 'name address')
        .populate('driver', 'name')
        .populate('containers', 'serialNumber type');

      res.json(updatedDelivery);
    } catch (error) {
      next(error);
    }
  }

  // Delete a delivery
  static async deleteDelivery(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid delivery ID');
      }

      const delivery = await Delivery.findById(req.params.id);
      if (!delivery) {
        throw createError(404, 'Delivery not found');
      }

      // Don't allow deletion of completed deliveries
      if (delivery.status === 'completed') {
        throw createError(400, 'Cannot delete completed deliveries');
      }

      await delivery.remove();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Update delivery status
  static async updateDeliveryStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid delivery ID');
      }

      const delivery = await Delivery.findById(req.params.id);
      if (!delivery) {
        throw createError(404, 'Delivery not found');
      }

      // Validate status transition
      const validTransitions = {
        scheduled: ['in_transit', 'cancelled'],
        in_transit: ['arrived', 'cancelled'],
        arrived: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      };

      if (!validTransitions[delivery.status].includes(status)) {
        throw createError(400, 'Invalid status transition');
      }

      delivery.status = status;
      delivery.statusHistory.push({
        status,
        timestamp: new Date(),
        updatedBy: req.user._id,
        notes
      });

      await delivery.save();
      await delivery.populate('customer', 'name address');
      await delivery.populate('driver', 'name');
      await delivery.populate('containers', 'serialNumber type');

      res.json(delivery);
    } catch (error) {
      next(error);
    }
  }

  // Assign driver to delivery
  static async assignDriver(req, res, next) {
    try {
      const { driverId } = req.body;

      if (!validateObjectId(req.params.id) || !validateObjectId(driverId)) {
        throw createError(400, 'Invalid delivery or driver ID');
      }

      const [delivery, driver] = await Promise.all([
        Delivery.findById(req.params.id),
        Driver.findById(driverId)
      ]);

      if (!delivery) {
        throw createError(404, 'Delivery not found');
      }
      if (!driver) {
        throw createError(404, 'Driver not found');
      }

      delivery.driver = driverId;
      await delivery.save();
      await delivery.populate('customer', 'name address');
      await delivery.populate('driver', 'name');
      await delivery.populate('containers', 'serialNumber type');

      res.json(delivery);
    } catch (error) {
      next(error);
    }
  }

  // Generate delivery manifest
  static async generateManifest(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid delivery ID');
      }

      const delivery = await Delivery.findById(req.params.id)
        .populate('customer', 'name address')
        .populate('driver', 'name')
        .populate('containers', 'serialNumber type status');

      if (!delivery) {
        throw createError(404, 'Delivery not found');
      }

      const doc = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=manifest-${delivery._id}.pdf`);

      // Pipe the PDF document to the response
      doc.pipe(res);

      // Generate PDF content
      doc.fontSize(20).text('Delivery Manifest', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Delivery ID: ${delivery._id}`);
      doc.text(`Date: ${delivery.scheduledDate.toLocaleDateString()}`);
      doc.moveDown();

      doc.fontSize(14).text('Customer Information');
      doc.fontSize(12).text(`Name: ${delivery.customer.name}`);
      doc.text(`Address: ${delivery.customer.address}`);
      doc.moveDown();

      if (delivery.driver) {
        doc.fontSize(14).text('Driver Information');
        doc.fontSize(12).text(`Name: ${delivery.driver.name}`);
        doc.moveDown();
      }

      doc.fontSize(14).text('Containers');
      delivery.containers.forEach(container => {
        doc.fontSize(12).text(`- ${container.serialNumber} (${container.type})`);
      });
      doc.moveDown();

      doc.fontSize(14).text('Status History');
      delivery.statusHistory.forEach(history => {
        doc.fontSize(12).text(`${history.status} - ${history.timestamp.toLocaleString()}`);
        if (history.notes) {
          doc.fontSize(10).text(`Notes: ${history.notes}`);
        }
      });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DeliveryController;
