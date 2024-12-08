const mongoose = require('mongoose');

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateVehicleData = (data) => {
  const errors = [];

  // Required fields
  const requiredFields = [
    'registrationNumber',
    'make',
    'model',
    'year',
    'vin',
    'fuelType',
    'lastService',
    'nextServiceDue',
    'insuranceNumber',
    'insuranceExpiry'
  ];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Validate year
  const currentYear = new Date().getFullYear();
  if (data.year && (data.year < 1900 || data.year > currentYear + 1)) {
    errors.push('Invalid year');
  }

  // Validate dates
  const validateDate = (date, fieldName) => {
    if (date && isNaN(new Date(date).getTime())) {
      errors.push(`Invalid ${fieldName}`);
    }
  };

  validateDate(data.lastService, 'lastService');
  validateDate(data.nextServiceDue, 'nextServiceDue');
  validateDate(data.insuranceExpiry, 'insuranceExpiry');

  // Validate fuel type
  const validFuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
  if (data.fuelType && !validFuelTypes.includes(data.fuelType)) {
    errors.push('Invalid fuel type');
  }

  // Validate mileage
  if (data.mileage && (isNaN(data.mileage) || data.mileage < 0)) {
    errors.push('Invalid mileage');
  }

  return errors;
};

const validateIncidentData = (data) => {
  const errors = [];

  // Required fields
  const requiredFields = ['type', 'date', 'location', 'description', 'driverName'];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Validate incident type
  const validTypes = ['accident', 'breakdown', 'maintenance', 'damage', 'other'];
  if (data.type && !validTypes.includes(data.type)) {
    errors.push('Invalid incident type');
  }

  // Validate date
  if (data.date && isNaN(new Date(data.date).getTime())) {
    errors.push('Invalid date');
  }

  // Validate cost
  if (data.cost && (isNaN(data.cost) || data.cost < 0)) {
    errors.push('Invalid cost');
  }

  // Validate status
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid status');
  }

  return errors;
};

const validateMaintenanceData = (data) => {
  const errors = [];

  // Required fields
  const requiredFields = ['type', 'date', 'mileage', 'description', 'cost'];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Validate maintenance type
  const validTypes = ['routine', 'repair', 'inspection', 'tire', 'other'];
  if (data.type && !validTypes.includes(data.type)) {
    errors.push('Invalid maintenance type');
  }

  // Validate date
  if (data.date && isNaN(new Date(data.date).getTime())) {
    errors.push('Invalid date');
  }

  // Validate mileage and cost
  if (data.mileage && (isNaN(data.mileage) || data.mileage < 0)) {
    errors.push('Invalid mileage');
  }

  if (data.cost && (isNaN(data.cost) || data.cost < 0)) {
    errors.push('Invalid cost');
  }

  // Validate parts array
  if (data.parts && Array.isArray(data.parts)) {
    data.parts.forEach((part, index) => {
      if (!part.name) {
        errors.push(`Part name is required at index ${index}`);
      }
      if (isNaN(part.quantity) || part.quantity <= 0) {
        errors.push(`Invalid quantity for part at index ${index}`);
      }
      if (isNaN(part.cost) || part.cost < 0) {
        errors.push(`Invalid cost for part at index ${index}`);
      }
    });
  }

  return errors;
};

module.exports = {
  validateObjectId,
  validateVehicleData,
  validateIncidentData,
  validateMaintenanceData
};
