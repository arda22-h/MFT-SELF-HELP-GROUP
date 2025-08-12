const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const bank_accounts = sequelize.define(
    'bank_accounts',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

account_name: {
        type: DataTypes.TEXT,

      },

account_number: {
        type: DataTypes.TEXT,

      },

balance: {
        type: DataTypes.DECIMAL,

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

  bank_accounts.associate = (db) => {

    db.bank_accounts.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.bank_accounts.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return bank_accounts;
};

