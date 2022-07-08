"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  info.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invoice: {
        type: DataTypes.STRING(5000),
        allowNull: false,
      },
      redeem_script: {
        type: DataTypes.STRING(5000),
        allowNull: false,
      },
      network: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      private_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timelock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      swap_amount: {
        type: DataTypes.DOUBLE(10, 8),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      txid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vout: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pre_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "info",
    }
  );
  return info;
};
