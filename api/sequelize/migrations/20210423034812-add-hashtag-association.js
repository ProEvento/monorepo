'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn(
      'Hashtags', // name of Source model
      'Event_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Hashtags', // name of the Target model
      'Event_id' // key we want to remove
    );
  }
};
