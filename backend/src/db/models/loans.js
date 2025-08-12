const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const loans = sequelize.define(
    'loans',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

amount: {
        type: DataTypes.DECIMAL,

      },

purpose: {
        type: DataTypes.TEXT,

      },

application_date: {
        type: DataTypes.DATE,

      },

repayment_date: {
        type: DataTypes.DATE,

      },

status: {
        type: DataTypes.ENUM,

        values: [

"Pending",

"Approved",

"Rejected"

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

  loans.associate = (db) => {

    db.loans.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.loans.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return loans;
};

