const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const expenses = sequelize.define(
    'expenses',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

amount: {
        type: DataTypes.DECIMAL,

      },

description: {
        type: DataTypes.TEXT,

      },

date: {
        type: DataTypes.DATE,

      },

category: {
        type: DataTypes.ENUM,

        values: [

"Operational",

"Project",

"Miscellaneous"

        ],

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

  expenses.associate = (db) => {

    db.expenses.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.expenses.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return expenses;
};

