'use strict';
module.exports = (sequelize, DataTypes) => {
const Comment = sequelize.define(
'Comment', { 
   id: {
      type: DataTypes.INTEGER, 
      primaryKey:true, 
      autoIncrement: true,
   }, 
   text: {
      type: DataTypes.STRING, 
      allowNull:false
   }, 
   date: {
      type: DataTypes.DATE, 
      allowNull:false
   }, 
   Event_id: {
      type: DataTypes.INTEGER
   }, 
   Target_id: {
      type: DataTypes.INTEGER
   }, 
   Author_id: {
      type: DataTypes.INTEGER, 
      allowNull:false
   }
}, { 
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'Comments'
  }
);

Comment.associate = function(models) {
   Comment.belongsTo(models.Event, {
      foreignKey: 'Event_id',
      target: 'id'
   });

   Comment.belongsTo(models.User, {
      as: 'target',  foreignKey: 'Target_id',
      target: 'id'
   });

   Comment.belongsTo(models.User, {
      as: 'author',  foreignKey: 'Author_id',
      target: 'id'
   });
}

return Comment;
};
