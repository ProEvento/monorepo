'use strict';
module.exports = (sequelize, DataTypes) => {
const Chat = sequelize.define(
'Chat', { 
    id: {
        type: DataTypes.INTEGER, 
        primaryKey:true, 
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING, 
        allowNull: false
    },

    }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'Chats',
    
    }
);

    Chat.associate = function(models) {
        Chat.belongsToMany(models.User, {
            through: "ChatUsers",
            as: 'members',
            target: 'id',
            constraints: false
        });

        Chat.hasMany(models.ChatMessage, { constraints: false, as: "messages" })

        Chat.belongsTo(models.Group, { as: "group" })
    }

    return Chat;
};
