const mongoose = require('mongoose');
const Vehicle = require('../models/vehicle');
const config = require('../config/config');

const sampleVehicles = [
  {
    registrationNumber: 'ABC123GP',
    make: 'Toyota',
    model: 'Hilux',
    year: 2022,
    vin: '1HGCM82633A123456',
    status: 'active',
    mileage: 15000,
    fuelType: 'diesel',
    lastService: new Date('2023-06-01'),
    nextServiceDue: new Date('2023-09-01'),
    insuranceNumber: 'INS-2023-001',
    insuranceExpiry: new Date('2024-06-01'),
    notes: 'Primary collection vehicle'
  },
  {
    registrationNumber: 'XYZ789GP',
    make: 'Isuzu',
    model: 'NPR',
    year: 2021,
    vin: '2HGCM82633B789012',
    status: 'active',
    mileage: 25000,
    fuelType: 'diesel',
    lastService: new Date('2023-05-15'),
    nextServiceDue: new Date('2023-08-15'),
    insuranceNumber: 'INS-2023-002',
    insuranceExpiry: new Date('2024-05-15'),
    notes: 'Secondary collection vehicle'
  },
  {
    registrationNumber: 'DEF456GP',
    make: 'Mercedes-Benz',
    model: 'Sprinter',
    year: 2023,
    vin: '3HGCM82633C345678',
    status: 'maintenance',
    mileage: 5000,
    fuelType: 'diesel',
    lastService: new Date('2023-07-01'),
    nextServiceDue: new Date('2023-10-01'),
    insuranceNumber: 'INS-2023-003',
    insuranceExpiry: new Date('2024-07-01'),
    notes: 'Specialized waste transport',
    incidents: [
      {
        type: 'maintenance',
        date: new Date('2023-07-01'),
        location: 'Main Depot',
        description: 'Scheduled maintenance check',
        driverName: 'John Smith',
        cost: 1500,
        status: 'resolved',
        resolvedDate: new Date('2023-07-02')
      }
    ],
    maintenanceHistory: [
      {
        type: 'routine',
        date: new Date('2023-07-01'),
        mileage: 5000,
        description: 'Regular service check',
        cost: 1500,
        provider: {
          name: 'AutoCare Services',
          contact: '011-555-0123',
          location: 'Johannesburg'
        },
        parts: [
          {
            name: 'Oil Filter',
            quantity: 1,
            cost: 250
          },
          {
            name: 'Engine Oil',
            quantity: 5,
            cost: 600
          }
        ]
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Vehicle.deleteMany({});
    console.log('Cleared existing vehicles');

    // Insert sample data
    await Vehicle.insertMany(sampleVehicles);
    console.log('Sample vehicles inserted successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
