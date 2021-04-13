'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('ChatMessages', { 
      id: Sequelize.INTEGER,
      text: Sequelize.STRING,
      author:Sequelize.INTEGER,
      chat:Sequelize.INTEGER,
    });

    await queryInterface.createTable('Chats', { 
      id: Sequelize.INTEGER,
      title: Sequelize.STRING,
      group: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('ChatMessages');
  }
};
