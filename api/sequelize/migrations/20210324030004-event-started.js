'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Events", "started", { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false })
    await queryInterface.addColumn("Events", "ended", { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Events", "started")
    await queryInterface.removeColumn("Events", "ended")
  }
};
