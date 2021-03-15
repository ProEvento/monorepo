'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Notification.init({
    targetID: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};