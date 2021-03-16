'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Events', // name of Source model
      'UserId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
  return  queryInterface.removeColumn(
    'Events', // name of Source model
    'UserId' // key we want to remove
  );
  }
};
