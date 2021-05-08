'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Groups', // name of Source model
      'pollTime', // name of the key we're adding 
      {
        type: Sequelize.DATE
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Groups", "pollTime")
  }
};
