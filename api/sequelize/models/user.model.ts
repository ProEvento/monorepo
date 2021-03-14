'use strict';
import {
  Model,
  DataType,
  Sequelize
} from 'sequelize-typescript'

module.exports = (sequelize: Sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: Model[]) {
      // define association here
    }
  };
  User.init({
    firstName: DataType.STRING,
    lastName: DataType.STRING,
    email: DataType.STRING,
    github: DataType.STRING,
    linkedin: DataType.STRING,
    bio: DataType.STRING(500),
    twitterHandle: DataType.STRING,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};