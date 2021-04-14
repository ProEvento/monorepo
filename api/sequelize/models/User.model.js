'use strict';
module.exports = (sequelize, DataTypes) => {
const User = sequelize.define(
'User', { 
   id: {
      type: DataTypes.INTEGER, 
      primaryKey:true, 
      autoIncrement: true,
   }, 
   firstName: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   lastName: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   email: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   username: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   github: {
      type: DataTypes.STRING
   }, 
   linked: {
      type: DataTypes.STRING
   }, 
   twitter: {
      type: DataTypes.STRING
   }, 
   bio: {
      type: DataTypes.STRING
   },
   picture: {
      type: DataTypes.STRING
   }
}, { 
  timestamps: false,
  paranoid: true,
  freezeTableName: true,
  tableName: 'Users'
  }
);

User.associate = function(models) {
   User.hasMany(models.Event, {
      as: 'hosting',
      foreignKey: 'User_id',
      target: 'id',
      constraints: false
   });

   User.belongsToMany(models.Event, {
      as: 'attending',
      target: 'id',
      through: 'AttendingTable',
   });

   User.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'Target_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   User.hasMany(models.Badge, {
      foreignKey: 'User_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   User.hasMany(models.Notification, {
      foreignKey: 'User_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   User.hasMany(models.Topic, {
      foreignKey: 'User_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   User.hasMany(models.Comment, {
      as: 'writtenComments', 
      foreignKey: 'Author_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   User.belongsToMany(models.User, {
      as: 'following',
      foreignKey: 'following',
      target: 'id',
      through: 'FollowersTable'
   });

   User.belongsToMany(models.User, {
      as: 'followers',
      foreignKey: 'followers',
      target: 'id',
      through: 'FollowersTable'
   });

   User.belongsToMany(models.Chat, {
      as: 'users',
      target: 'id',
      through: 'ChatUsers'
   });

   User.belongsToMany(models.Group, {       
      through: "Users_Groups",
      as: 'groups',
      target: 'id',
   });

   User.hasMany(models.Group, {
      as: 'owned',
      foreignKey: 'User_id',
      target: 'id',
      constraints: false
   });
}

return User;
};
