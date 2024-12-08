const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Delivery extends Model {
    static associate(models) {
      Delivery.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Delivery.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
      Delivery.belongsTo(models.Driver, { foreignKey: 'driverId' });
      Delivery.hasMany(models.ContainerHistory, { foreignKey: 'deliveryId' });
    }
  }

  Delivery.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('delivery', 'collection', 'both'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'allocated', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    completedDate: {
      type: DataTypes.DATE
    },
    sequence: {
      type: DataTypes.INTEGER
    },
    notes: {
      type: DataTypes.TEXT
    },
    manifestNumber: {
      type: DataTypes.STRING
    },
    totalWeight: {
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Delivery',
    tableName: 'deliveries',
    timestamps: true
  });

  return Delivery;
};
