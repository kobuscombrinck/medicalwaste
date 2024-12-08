const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContainerHistory extends Model {
    static associate(models) {
      ContainerHistory.belongsTo(models.Container, { foreignKey: 'containerId' });
      ContainerHistory.belongsTo(models.Delivery, { foreignKey: 'deliveryId' });
      ContainerHistory.belongsTo(models.Customer, { foreignKey: 'customerId' });
    }
  }

  ContainerHistory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    containerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    deliveryId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('delivered', 'collected', 'cleaned', 'disposed'),
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2)
    },
    wasteType: {
      type: DataTypes.STRING
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2)
    },
    notes: {
      type: DataTypes.TEXT
    },
    scannedLocation: {
      type: DataTypes.GEOMETRY('POINT')
    },
    scannedBy: {
      type: DataTypes.UUID,
      allowNull: false
    },
    manifestNumber: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ContainerHistory',
    tableName: 'container_history',
    timestamps: true,
    indexes: [
      {
        fields: ['containerId']
      },
      {
        fields: ['deliveryId']
      },
      {
        fields: ['customerId']
      },
      {
        fields: ['scannedBy']
      }
    ]
  });

  return ContainerHistory;
};
