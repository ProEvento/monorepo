'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // name of Source model
        'deleted', // name of the key we're adding 
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "deleted")
    ]);
  }
};
