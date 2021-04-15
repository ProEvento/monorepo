"use strict";
module.exports = (sequelize, DataTypes) => {
  const GroupCategory = sequelize.define(
    "GroupCategory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
      tableName: "GroupCategoryOptions",
    }
  );

  GroupCategory.associate = function (models) {
    GroupCategory.belongsToMany(models.Group, {
      through: "Group_Categories",
      as: 'groups',
      target: 'id',
      foreignKey: 'group'
    })

  //   Group.belongsTo(models.User, {
  //     as: 'owner',
  //     foreignKey: 'User_id',
  //     target: 'id',
  //     type: DataTypes.INTEGER,
  //     constraints: false
  //  });

  };

  return GroupCategory;
};
