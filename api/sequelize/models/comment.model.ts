'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize: Sequelize) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  };
  Comment.init({
    targetID: DataType.INTEGER,
    text: DataType.TEXT,
    time: DataType.DATE,
    isEvent: DataType.BOOLEAN
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};