const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const contributions = sequelize.define(
    'contributions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

amount: {
        type: DataTypes.DECIMAL,

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

  contributions.associate = (db) => {

    db.contributions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.contributions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return contributions;
};

