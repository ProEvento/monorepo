'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Suggestions', // name of Source model
      'votes', // name of the key we're adding 
      {
        type: Sequelize.INTEGER
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Suggestions", "votes")
  }
};
