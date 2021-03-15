'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'UserEvents',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        UserId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        EventId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserEvents');
  }
};
