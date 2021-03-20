'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "picture", { type: Sequelize.DataTypes.STRING })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "picture")
  }
};
