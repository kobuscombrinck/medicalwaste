const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VehicleInspection extends Model {
    static associate(models) {
      VehicleInspection.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
      VehicleInspection.belongsTo(models.Driver, { foreignKey: 'driverId' });
    }
  }

  VehicleInspection.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    inspectionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    type: {
      type: DataTypes.ENUM('pre_trip', 'post_trip', 'maintenance'),
      allowNull: false
    },
    odometerReading: {
      type: DataTypes.INTEGER
    },
    fuelLevel: {
      type: DataTypes.STRING
    },
    checkList: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    issues: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    notes: {
      type: DataTypes.TEXT
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pass', 'fail', 'needs_attention'),
      allowNull: false
    },
    signature: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'VehicleInspection',
    tableName: 'vehicle_inspections',
    timestamps: true
  });

  return VehicleInspection;
};
