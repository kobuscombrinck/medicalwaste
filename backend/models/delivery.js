const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  containers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Container'
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['pickup', 'delivery', 'exchange'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_transit', 'arrived', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  notes: {
    type: String
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['scheduled', 'in_transit', 'arrived', 'in_progress', 'completed', 'cancelled'],
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
deliverySchema.index({ scheduledDate: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ customer: 1 });
deliverySchema.index({ driver: 1 });

// Virtual for delivery duration
deliverySchema.virtual('duration').get(function() {
  if (this.statusHistory && this.statusHistory.length > 1) {
    const start = this.statusHistory[0].timestamp;
    const end = this.status === 'completed' 
      ? this.statusHistory[this.statusHistory.length - 1].timestamp
      : new Date();
    return end - start;
  }
  return 0;
});

// Method to check if delivery can be modified
deliverySchema.methods.canModify = function() {
  return !['completed', 'cancelled'].includes(this.status);
};

// Method to validate status transition
deliverySchema.methods.canTransitionTo = function(newStatus) {
  const validTransitions = {
    scheduled: ['in_transit', 'cancelled'],
    in_transit: ['arrived', 'cancelled'],
    arrived: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: []
  };

  return validTransitions[this.status].includes(newStatus);
};

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
