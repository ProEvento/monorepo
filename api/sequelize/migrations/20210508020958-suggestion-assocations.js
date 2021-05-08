'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Suggestions", "startTime"),
      queryInterface.removeColumn("Suggestions", "endTime"),
      queryInterface.addColumn(
        'Suggestions', // name of Source model
        'time', // name of the key we're adding 
        {
          type: Sequelize.DATE,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'Suggestions', // name of Source model
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
      ),
      queryInterface.addColumn(
        'Suggestions', // name of Source model
        'User_id', // name of the key we're adding 
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Suggestions", "startTime"),
      queryInterface.addColumn("Suggestions", "endTime"),
      queryInterface.removeColumn("Suggestions", "time"),
      queryInterface.removeColumn("Suggestions", "Topic_id"),
      queryInterface.removeColumn("Suggestions", "User_id")
    ]);
  }
};
