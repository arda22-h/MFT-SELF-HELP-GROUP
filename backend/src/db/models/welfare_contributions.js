const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const welfare_contributions = sequelize.define(
    'welfare_contributions',
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

  welfare_contributions.associate = (db) => {

    db.welfare_contributions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.welfare_contributions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return welfare_contributions;
};

