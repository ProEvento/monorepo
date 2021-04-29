'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Events', // name of Source model
        'record', // name of the key we're adding 
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Events", "record")
    ]);
  }
};
