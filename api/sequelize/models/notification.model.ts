'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize: Sequelize) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Notification.belongsTo(models.User);
    }
  };
  Notification.init({
    text: DataType.TEXT,
    time: DataType.DATE
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};