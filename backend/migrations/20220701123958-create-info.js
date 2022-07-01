"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("infos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      invoice: {
        type: Sequelize.STRING(5000),
        allowNull: false,
      },
      redeem_script: {
        type: Sequelize.STRING(5000),
        allowNull: false,
      },
      network: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      private_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timelock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      swap_amount: {
        type: Sequelize.DOUBLE(10, 8),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      txid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vout: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("infos");
  },
};
