const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Container extends Model {
    static associate(models) {
      Container.belongsTo(models.Customer, { foreignKey: 'currentCustomerId' });
      Container.hasMany(models.ContainerHistory, { foreignKey: 'containerId' });
    }
  }

  Container.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('sacrificial', 'reusable'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'in_use', 'in_transit', 'disposed'),
      defaultValue: 'available'
    },
    currentCustomerId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    lastUsedDate: {
      type: DataTypes.DATE
    },
    lastCleanedDate: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Container',
    tableName: 'containers',
    timestamps: true
  });

  return Container;
};
