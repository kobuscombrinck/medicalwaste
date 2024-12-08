const Vehicle = require('../models/vehicle');
const { uploadToStorage, deleteFromStorage } = require('../utils/storage');
const { createError } = require('../utils/error');
const { validateObjectId } = require('../utils/validation');

class VehicleController {
  // Get all vehicles
  static async getVehicles(req, res, next) {
    try {
      const vehicles = await Vehicle.find()
        .populate('assignedDriver', 'name')
        .sort({ createdAt: -1 });

      res.json(vehicles);
    } catch (error) {
      next(error);
    }
  }

  // Get vehicle by ID
  static async getVehicleById(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const vehicle = await Vehicle.findById(req.params.id)
        .populate('assignedDriver', 'name')
        .populate('incidents.reportedBy', 'name')
        .populate('maintenanceHistory.performedBy', 'name')
        .populate('documents.addedBy', 'name');

      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Create new vehicle
  static async createVehicle(req, res, next) {
    try {
      const vehicleData = req.body;
      
      // Check for duplicate registration number
      const existingVehicle = await Vehicle.findOne({
        registrationNumber: vehicleData.registrationNumber
      });
      
      if (existingVehicle) {
        throw createError(400, 'Registration number already exists');
      }

      const vehicle = new Vehicle(vehicleData);
      await vehicle.save();

      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Update vehicle
  static async updateVehicle(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const updates = req.body;
      
      // Check for duplicate registration number if it's being updated
      if (updates.registrationNumber) {
        const existingVehicle = await Vehicle.findOne({
          registrationNumber: updates.registrationNumber,
          _id: { $ne: req.params.id }
        });
        
        if (existingVehicle) {
          throw createError(400, 'Registration number already exists');
        }
      }

      const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      ).populate('assignedDriver', 'name');

      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Delete vehicle
  static async deleteVehicle(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      // Delete associated documents from storage
      for (const doc of vehicle.documents) {
        await deleteFromStorage(doc.fileUrl);
      }

      await vehicle.remove();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Add incident
  static async addIncident(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      const incident = {
        ...req.body,
        reportedBy: req.user._id
      };

      vehicle.incidents.push(incident);
      await vehicle.save();

      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Update incident
  static async updateIncident(req, res, next) {
    try {
      if (!validateObjectId(req.params.id) || !validateObjectId(req.params.incidentId)) {
        throw createError(400, 'Invalid ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      const incident = vehicle.incidents.id(req.params.incidentId);
      
      if (!incident) {
        throw createError(404, 'Incident not found');
      }

      Object.assign(incident, req.body);
      await vehicle.save();

      res.json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Delete incident
  static async deleteIncident(req, res, next) {
    try {
      if (!validateObjectId(req.params.id) || !validateObjectId(req.params.incidentId)) {
        throw createError(400, 'Invalid ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      vehicle.incidents.pull(req.params.incidentId);
      await vehicle.save();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Add document
  static async addDocument(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      if (!req.file) {
        throw createError(400, 'No file uploaded');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      // Upload file to storage
      const fileUrl = await uploadToStorage(req.file);

      const document = {
        ...req.body,
        fileUrl,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        addedBy: req.user._id
      };

      vehicle.documents.push(document);
      await vehicle.save();

      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Delete document
  static async deleteDocument(req, res, next) {
    try {
      if (!validateObjectId(req.params.id) || !validateObjectId(req.params.documentId)) {
        throw createError(400, 'Invalid ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      const document = vehicle.documents.id(req.params.documentId);
      
      if (!document) {
        throw createError(404, 'Document not found');
      }

      // Delete file from storage
      await deleteFromStorage(document.fileUrl);

      vehicle.documents.pull(req.params.documentId);
      await vehicle.save();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Add maintenance record
  static async addMaintenance(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      const maintenance = {
        ...req.body,
        performedBy: req.user._id
      };

      vehicle.maintenanceHistory.push(maintenance);
      
      // Update last service date if this is a service
      if (maintenance.type === 'routine') {
        vehicle.lastService = maintenance.date;
        vehicle.nextServiceDue = new Date(maintenance.date);
        vehicle.nextServiceDue.setMonth(vehicle.nextServiceDue.getMonth() + 3);
      }

      await vehicle.save();

      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Get maintenance history
  static async getMaintenanceHistory(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const vehicle = await Vehicle.findById(req.params.id)
        .select('maintenanceHistory')
        .populate('maintenanceHistory.performedBy', 'name');

      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      res.json(vehicle.maintenanceHistory);
    } catch (error) {
      next(error);
    }
  }

  // Get vehicle statistics
  static async getVehicleStats(req, res, next) {
    try {
      if (!validateObjectId(req.params.id)) {
        throw createError(400, 'Invalid vehicle ID');
      }

      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        throw createError(404, 'Vehicle not found');
      }

      const stats = {
        totalIncidents: vehicle.incidents.length,
        openIncidents: vehicle.incidents.filter(i => i.status === 'open').length,
        totalMaintenanceCost: vehicle.getTotalMaintenanceCost(),
        daysUntilService: vehicle.daysUntilService,
        insuranceStatus: vehicle.insuranceStatus,
        documentsCount: vehicle.documents.length,
        expiringDocuments: vehicle.documents.filter(d => 
          d.expiryDate && new Date(d.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length
      };

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleController;
