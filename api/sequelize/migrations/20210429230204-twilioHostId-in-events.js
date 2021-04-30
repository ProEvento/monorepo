'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        'Events', // name of Source model
        'hostTwilioId', // name of the key we're adding 
        {
          type: Sequelize.STRING,
          defaultValue: '',
          allowNull: true
        }
      )

      await queryInterface.addColumn(
        'Events', // name of Source model
        'roomTwilioId',
        {
          type: Sequelize.STRING,
          defaultValue: '',
          allowNull: true
       }
      )

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'hostTwilioId')
    await queryInterface.removeColumn('Events', 'roomTwilioId')
  }
};
