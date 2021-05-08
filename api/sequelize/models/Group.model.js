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
      pollTime: {
        type: DataTypes.DATE,
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
    Group.belongsToMany(models.User, {
      through: "Users_Groups",
      as: 'users',
      target: 'id',
    })

    Group.belongsToMany(models.GroupCategory, {
      through: "Group_Categories",
      as: 'categories',
      target: 'id',
      foreignKey: 'category'
    })

    Group.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'User_id',
      target: 'id',
      type: DataTypes.INTEGER,
      constraints: false
   });

   Group.hasOne(models.Chat, {
     as: "chat",
   })


  };

  return Group;
};
