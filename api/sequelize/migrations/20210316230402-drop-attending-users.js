'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'attendingUsers');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'attendingUsers', Sequelize.STRING)
  }
};
