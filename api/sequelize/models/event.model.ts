'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Event.init({
    private: DataTypes.BOOLEAN,
    invitedUsers: DataTypes.STRING,
    attendingUsers: DataTypes.STRING,
    time: DataTypes.DATE,
    description: DataTypes.TEXT,
    topics: DataTypes.STRING,
    meetingURL: DataTypes.STRING,
    comments: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};