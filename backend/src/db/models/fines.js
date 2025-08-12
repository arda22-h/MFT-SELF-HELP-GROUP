const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const fines = sequelize.define(
    'fines',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

amount: {
        type: DataTypes.DECIMAL,

      },

reason: {
        type: DataTypes.TEXT,

      },

date: {
        type: DataTypes.DATE,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  fines.associate = (db) => {

    db.fines.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.fines.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return fines;
};

