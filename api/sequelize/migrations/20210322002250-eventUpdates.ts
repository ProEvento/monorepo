'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn("Events", "private", "priv"),
      queryInterface.addColumn("Events", "picture", { type: Sequelize.DataTypes.STRING })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn("Events", "priv", "private"),
      queryInterface.removeColumn("Events", "picture")
    ]);
  }
};
