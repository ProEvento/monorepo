'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      private: {
        type: Sequelize.BOOLEAN
      },
      invitedUsers: {
        type: Sequelize.STRING
      },
      attendingUsers: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.TEXT
      },
      topics: {
        type: Sequelize.STRING
      },
      meetingURL: {
        type: Sequelize.STRING
      },
      comments: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};