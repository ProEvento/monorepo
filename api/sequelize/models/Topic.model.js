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
   Topic.hasMany(models.Event, {
      foreignKey: 'Topic_id',
      target: 'id',
      type: DataTypes.INTEGER
   });
}


return Topic;
};
