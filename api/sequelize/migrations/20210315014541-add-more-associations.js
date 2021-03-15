'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // name of Source model
        'TopicId', // name of the key we're adding 
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Topics', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      ),
      queryInterface.removeColumn(
        'Notifications', // name of Source model
        'targetID' // key we want to remove
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(
        'Users', // name of Source model
        'TopicId' // key we want to remove
      ),
      queryInterface.addColumn(
        'Notifications', // name of Source model
        'targetID' // key we want to remove
      )
    ]);
  }
};
