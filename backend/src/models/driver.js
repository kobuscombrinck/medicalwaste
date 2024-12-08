const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    static associate(models) {
      Driver.hasMany(models.Delivery, { foreignKey: 'driverId' });
      Driver.hasOne(models.Vehicle, { foreignKey: 'currentDriverId' });
      Driver.belongsTo(models.User, { foreignKey: 'userId' });
      Driver.hasMany(models.VehicleInspection, { foreignKey: 'driverId' });
    }
  }

  Driver.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    licenseExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    licenseType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
      defaultValue: 'active'
    },
    emergencyContact: {
      type: DataTypes.STRING
    },
    emergencyPhone: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Driver',
    tableName: 'drivers',
    timestamps: true
  });

  return Driver;
};
