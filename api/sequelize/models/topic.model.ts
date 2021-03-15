'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize: Sequelize) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Topic.belongsTo(models.User);
    }
  };
  Topic.init({
    text: DataType.STRING
  }, {
    sequelize,
    modelName: 'Topic',
  });
  return Topic;
};