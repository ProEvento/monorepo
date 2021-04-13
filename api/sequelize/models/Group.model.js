"use strict";
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
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
      description: DataTypes.STRING,
      logo: DataTypes.STRING,
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      tableName: "Groups",
    }
  );

  Group.associate = function (models) {
    Group.belongsToMany(models.User, { through: "Users_Groups" })
    Group.belongsTo(models.User, { as: "host" })
  };

  return Group;
};
