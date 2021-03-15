'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize: Sequelize) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Event.belongsToMany(models.User, { through: 'UserEvent'});
    }
  };
  Event.init({
    private: DataType.BOOLEAN,
    invitedUsers: DataType.STRING,
    attendingUsers: DataType.STRING,
    time: DataType.DATE,
    description: DataType.TEXT,
    topics: DataType.STRING,
    meetingURL: DataType.STRING,
    comments: DataType.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};