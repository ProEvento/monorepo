"use strict";
module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define(
    "Suggestion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE, 
        allowNull:false
      }
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: "Suggestions",
    }
  );

  Suggestion.associate = function (models) {
    Suggestion.belongsTo(models.Topic, {
        foreignKey: 'Topic_id',
        target: 'id',
        type: DataTypes.INTEGER
     });

     Suggestion.belongsTo(models.User, {
        foreignKey: 'User_id',
        target: 'id',
        type: DataTypes.INTEGER,
     });
  };

  return Suggestion;
};
