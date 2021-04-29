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
   priv: {
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
   picture: {
      type: DataTypes.STRING,
      allowNull:true
   },
   started: {
      type: DataTypes.BOOLEAN,
      deafultValue: false
   },
   ended: {
      type: DataTypes.BOOLEAN,
      deafultValue: false
   },
   record: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
   }
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
      type: DataTypes.INTEGER,
      constraints: false
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

   Event.hasMany(models.Hashtag, {
      foreignKey: 'Event_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

   Event.belongsTo(models.Topic, {
      foreignKey: 'Topic_id',
      target: 'id',
      type: DataTypes.INTEGER
   });

}

return Event;
};
