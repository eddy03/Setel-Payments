'use strict'

module.exports = (sequelize, DataTypes) => {
  const SCHEMA = {
    orderId: {
      type: DataTypes.STRING(255)
    },
    isSuccess: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false
    }
  }

  const OPTIONS = {
    tableName: 'payments',
    underscored: true,
    constraints: false,
    paranoid: true
  }

  const accounts = sequelize.define('payments', SCHEMA, OPTIONS)

  accounts.associate = models => {

  }

  return accounts
}
