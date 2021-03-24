'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Topics", "Event_id"),
      queryInterface.addColumn(
        'Events', // name of Source model
        'Topic_id', // name of the key we're adding 
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Topics', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Topics", "Event_id"),
      queryInterface.removeColumn("Events", "Topic_id")
    ]);
  }
};
