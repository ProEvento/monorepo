'use strict';
module.exports = (sequelize, DataTypes) => {
const ChatMessage = sequelize.define(
'ChatMessage', { 
    id: {
        type: DataTypes.INTEGER, 
        primaryKey:true, 
        autoIncrement: true,
    }, 
    text: {
        type: DataTypes.STRING, 
        allowNull:false
    },
    }, { 
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ChatMessages'
    }
);

    ChatMessage.associate = function(models) {  
       ChatMessage.belongsTo(models.User, { as: "author" })
       ChatMessage.belongsTo(models.Chat, { constraints: false })
    }

    return ChatMessage;
};
