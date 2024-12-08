const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      Vehicle.hasMany(models.Delivery, { foreignKey: 'vehicleId' });
      Vehicle.hasMany(models.VehicleInspection, { foreignKey: 'vehicleId' });
      Vehicle.hasMany(models.Incident, { foreignKey: 'vehicleId' });
      Vehicle.belongsTo(models.Driver, { foreignKey: 'currentDriverId' });
    }
  }

  Vehicle.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    fleetNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    type: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    },
    currentDriverId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'maintenance', 'retired'),
      defaultValue: 'active'
    },
    lastMaintenanceDate: {
      type: DataTypes.DATE
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true
  });

  return Vehicle;
};
