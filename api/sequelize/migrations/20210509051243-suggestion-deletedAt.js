'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Suggestions', // name of Source model
      'deletedAT', // name of the key we're adding 
      {
        type: Sequelize.DATE
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Suggestions", "deletedAT")
  }
};
