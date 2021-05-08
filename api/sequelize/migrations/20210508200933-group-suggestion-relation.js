'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Suggestions', // name of Source model
      'Group_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Groups', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Suggestions", "Group_id");
  }
};
