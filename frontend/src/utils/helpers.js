// Date formatting
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Status colors
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
    completed: 'success',
    'in progress': 'warning',
    'under investigation': 'warning',
    resolved: 'success',
    maintenance: 'info',
  };
  return statusColors[status.toLowerCase()] || 'default';
};

// Priority colors
export const getPriorityColor = (priority) => {
  const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'success',
  };
  return priorityColors[priority.toLowerCase()] || 'default';
};

// Weight formatting
export const formatWeight = (weight) => {
  return `${weight.toFixed(2)} kg`;
};

// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+27|0)[1-9][0-9]{8}$/;
  return phoneRegex.test(phone);
};

export const isValidVehicleNumber = (number) => {
  const vehicleRegex = /^MWV-\d{3}$/;
  return vehicleRegex.test(number);
};

// Error message formatting
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unknown error occurred';
};

// Local storage helpers
export const getLocalStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Constants
export const ROLES = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  DRIVER: 'Driver',
  STAFF: 'Staff',
};

export const VEHICLE_STATUSES = {
  ACTIVE: 'Active',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Out of Service',
  RESERVED: 'Reserved',
};

export const COLLECTION_STATUSES = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const INCIDENT_SEVERITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const MAINTENANCE_TYPES = {
  SCHEDULED: 'Scheduled Service',
  REPAIR: 'Repair',
  INSPECTION: 'Inspection',
  EMERGENCY: 'Emergency',
};
