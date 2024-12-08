const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['invoice', 'license', 'insurance', 'registration', 'maintenance', 'fine', 'other']
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  mimeType: String,
  fileSize: Number,
  dateAdded: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  notes: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['accident', 'breakdown', 'maintenance', 'damage', 'other']
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    default: 0
  },
  thirdPartyInvolved: {
    type: Boolean,
    default: false
  },
  thirdPartyDetails: String,
  policeReport: {
    type: Boolean,
    default: false
  },
  policeReportNumber: String,
  insuranceClaim: {
    type: Boolean,
    default: false
  },
  insuranceClaimNumber: String,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  resolutionNotes: String,
  resolvedDate: Date
});

const maintenanceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['routine', 'repair', 'inspection', 'tire', 'other']
  },
  date: {
    type: Date,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  provider: {
    name: String,
    contact: String,
    location: String
  },
  parts: [{
    name: String,
    quantity: Number,
    cost: Number
  }],
  notes: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  vin: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'out_of_service'],
    default: 'active'
  },
  mileage: {
    type: Number,
    required: true,
    default: 0
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['petrol', 'diesel', 'electric', 'hybrid']
  },
  lastService: {
    type: Date,
    required: true
  },
  nextServiceDue: {
    type: Date,
    required: true
  },
  insuranceNumber: {
    type: String,
    required: true
  },
  insuranceExpiry: {
    type: Date,
    required: true
  },
  notes: String,
  documents: [documentSchema],
  incidents: [incidentSchema],
  maintenanceHistory: [maintenanceSchema],
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  }
}, {
  timestamps: true
});

// Indexes
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ vin: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ assignedDriver: 1 });
vehicleSchema.index({ 'documents.expiryDate': 1 });
vehicleSchema.index({ 'incidents.date': 1 });
vehicleSchema.index({ 'maintenanceHistory.date': 1 });

// Virtual for days until next service
vehicleSchema.virtual('daysUntilService').get(function() {
  const today = new Date();
  const nextService = new Date(this.nextServiceDue);
  const diffTime = nextService - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for insurance status
vehicleSchema.virtual('insuranceStatus').get(function() {
  const today = new Date();
  const expiry = new Date(this.insuranceExpiry);
  return expiry > today ? 'valid' : 'expired';
});

// Method to check if service is due
vehicleSchema.methods.isServiceDue = function() {
  return this.daysUntilService <= 7;
};

// Method to check if insurance is expiring soon
vehicleSchema.methods.isInsuranceExpiringSoon = function(days = 30) {
  const today = new Date();
  const expiry = new Date(this.insuranceExpiry);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

// Method to calculate total maintenance cost
vehicleSchema.methods.getTotalMaintenanceCost = function(startDate, endDate) {
  return this.maintenanceHistory.reduce((total, record) => {
    if ((!startDate || record.date >= startDate) && 
        (!endDate || record.date <= endDate)) {
      return total + record.cost;
    }
    return total;
  }, 0);
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
