'use strict';
module.exports = (sequelize, DataTypes) => {
const Topic = sequelize.define(
'Topic', { 
   id: {
      type: DataTypes.INTEGER, 
      primaryKey:true, 
      autoIncrement: true,
   }, 
   title: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   Event_id: {
      type: DataTypes.INTEGER
   }, 
   User_id: {
      type: DataTypes.INTEGER
   }
}, { 
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'Topics'
  }
);

Topic.associate = function(models) {
   Topic.belongsTo(models.Event, {
   foreignKey: 'Event_id',
   target: 'id'
   });

}

return Topic;
};
