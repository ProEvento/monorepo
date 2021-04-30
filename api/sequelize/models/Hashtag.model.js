'use strict';
module.exports = (sequelize, DataTypes) => {
const Hashtag = sequelize.define(
'Hashtag', { 
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
      type: DataTypes.INTEGER, 
   }
}, { 
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'Hashtags'
  }
);

Hashtag.associate = function(models) {
   Hashtag.belongsTo(models.Event, {
      foreignKey: 'Event_id',
      target: 'id'
   });
}

return Hashtag;
};
