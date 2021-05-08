'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Suggestions', // name of Source model
      'active', // name of the key we're adding 
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Suggestions", "active")
  }
};
