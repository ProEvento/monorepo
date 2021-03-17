'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //  await queryInterface.removeColumn(
    //     'Events', // name of Source model
    //     'invitedUsers' // key we want to remove
    //   );
    //   // await queryInterface.removeColumn('Events', 'UserId');
  

  },
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn(
    //   'Events', // name of Source model
    //   'invitedUsers', // key we want to add
    //   {
    //     type: Sequelize.STRING
    //   }
    // );
  }
};
