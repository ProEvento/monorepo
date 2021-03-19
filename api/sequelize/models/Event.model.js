'use strict';
module.exports = (sequelize, DataTypes) => {
const Event = sequelize.define(
'Event', { 
   id: {
      type: DataTypes.INTEGER, 
      primaryKey:true, 
      autoIncrement: true,
   }, 
   User_id: {
      type: DataTypes.UUID, 
      allowNull:false
   }, 
   private: {
      type: DataTypes.BOOLEAN, 
      allowNull:false
   }, 
   time: {
      type: DataTypes.DATE, 
      allowNull:false
   }, 
   private: {
      type: DataTypes.BOOLEAN, 
      allowNull:false
   }, 
   time: {
      type: DataTypes.DATE, 
      allowNull:false
   }, 
   description: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   title: {
      type: DataTypes.STRING, 
      allowNull:false
   },
}, { 
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'Events'
  }
);

Event.associate = function(models) {
   Event.belongsTo(models.User, {
      as: 'host',
      foreignKey: 'User_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   Event.belongsToMany(models.User, {
      as: 'attendees',
      target: 'id',
      through: 'AttendingTable',
   });

   Event.hasMany(models.Comment, {
      foreignKey: 'Event_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   Event.hasMany(models.Topic, {
      foreignKey: 'Event_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

}

return Event;
};
