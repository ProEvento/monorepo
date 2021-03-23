'use strict';
module.exports = (sequelize, DataTypes) => {
const Notification = sequelize.define(
'Notification', { 
   id: {
      type: DataTypes.INTEGER, 
      primaryKey:true, 
      autoIncrement: true,
   }, 
   text: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   User_id: {
      type: DataTypes.INTEGER, 
   }
}, { 
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'Notifications'
  }
);

Notification.associate = function(models) {
   Notification.belongsTo(models.User, {
      foreignKey: 'User_id',
      target: 'id'
   });
}

return Notification;
};
