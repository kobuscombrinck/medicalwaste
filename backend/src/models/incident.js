const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Incident extends Model {
    static associate(models) {
      Incident.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
      Incident.belongsTo(models.Driver, { foreignKey: 'driverId' });
    }
  }

  Incident.init({
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
    type: {
      type: DataTypes.ENUM('accident', 'theft', 'damage', 'maintenance', 'other'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('minor', 'moderate', 'major', 'critical'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('reported', 'investigating', 'resolved', 'closed'),
      defaultValue: 'reported'
    },
    policeReport: {
      type: DataTypes.STRING
    },
    insuranceClaim: {
      type: DataTypes.STRING
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    witnesses: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    costs: {
      type: DataTypes.DECIMAL(10, 2)
    },
    resolutionNotes: {
      type: DataTypes.TEXT
    },
    reportNumber: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Incident',
    tableName: 'incidents',
    timestamps: true,
    hooks: {
      beforeCreate: async (incident) => {
        // Generate a unique report number
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        incident.reportNumber = `INC-${year}${month}-${random}`;
      }
    }
  });

  return Incident;
};
