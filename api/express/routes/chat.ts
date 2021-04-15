

import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;
import { getIdParam } from '../helpers'
const {Op} = require('sequelize');
// import Op from '../../sequelize'


async function getAll(req: Request, res: Response) {
	const Chats = await models.Chat.findAll({ include: [{model: models.User, as: "members", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}, {model: models.ChatMessage, as: "messages", include: [{model: models.User, as: "author", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}]}] });
	res.status(200).json(Chats);
};

async function getById(req: Request, res: Response) {
    const id = getIdParam(req);
	const Chats = await models.Chat.findOne({ where: { id: id}, include: [{model: models.User, as: "members", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}, {model: models.ChatMessage, as: "messages", include: [{model: models.User, as: "author", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}]}] });
	res.status(200).json(Chats);
};

async function getDM(req: Request, res: Response) {
    const id = getIdParam(req);
    const {targetId} = req.query;
    let chat = null;
    // const Chats = await models.Chat.findAll({ include: [{model: models.User, as: "members", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}, {model: models.Group, as: "group", attributes: ['id', 'name']}, {model: models.ChatMessage, as: "messages", include: [{model: models.User, as: "author", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}]}] });
    const Chats = await models.Chat.findAll({ include: [{model: models.User, as: "members", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}, {model: models.ChatMessage, as: "messages", include: [{model: models.User, as: "author", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}]}] });

    for (const chatObj of Chats) {

        let containsUser = false;
        let containstarget= false;

        //@ts-ignore
        // if (chatObj.group != null) continue;

        // Only look for chats with2 users
        if (chatObj.members.size != 2) continue
        
        //@ts-ignore
        for (const member of chatObj.members) {
            if (member.id == id) containsUser = true;
            if (member.id == targetId) containstarget = true
        }

        if (containsUser && containstarget) {
            console.log("Chat found: " ,chat)
            chat = chatObj;
            break;
        }
    }

    // Chat does not exist, so make one
    if (chat == null) {

        chat = await models.Chat.create({ title: "Regular Chat" })

        const user = await models.User.findOne({ where: { id: id }})
        const targetUser = await models.User.findOne({ where: { id: targetId }})

        //@ts-ignore
        chat.addMember(user)

        //@ts-ignore
        chat.addMember(targetUser)
    }
	res.status(200).json(chat);
};

async function getGroupchat(req: Request, res: Response) {
    const id = getIdParam(req);

    // const Chats = await models.Chat.findAll({ include: [{model: models.User, as: "members", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}, {model: models.Group, as: "group", attributes: ['id', 'name']}, {model: models.ChatMessage, as: "messages", include: [{model: models.User, as: "author", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}]}] });
    const chat = await models.Chat.findOne({ where: { groupId: id}, include: [{model: models.User, as: "members", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}, {model: models.ChatMessage, as: "messages", include: [{model: models.User, as: "author", attributes: ['username', 'id', 'picture', 'firstName', 'lastName']}]}] });

	res.status(200).json(chat);
};



async function create(req: Request, res: Response) {
    // title: string, members: id of users []
    const { title, members } = req.body;
    const Chat = await models.Chat.create({ title })
    for (const member of members) {
        const User = await models.User.findOne({ where: { id: member }})

        //@ts-ignore
        Chat.addMember(User)
    }
    //@ts-ignore
    res.json(await Chat.getMembers());
}

async function sendMessage(req: Request, res: Response) {
    const id = getIdParam(req);
    const { authorId, message } = req.query;

    const Chat = await models.Chat.findOne({ where: { id: id }});
    if (!Chat) {
        return res.status(404).json({message: "Chat not found."})
    }

    const User = await models.User.findOne({ where: { id: authorId }})
    if (!User) {
        return res.status(404).json({message: "User not found."})
    }

    //@ts-ignore
    const ChatUsers = await Chat.getMembers()

    let inChat = false;
    for (const Chatter of ChatUsers) {
        //@ts-ignore
        if (Chatter.username === User.username) {
            inChat = true
            break
        }
    }

    if (!inChat) {
        return res.status(500).json({ message: "Not in this chat."})
    }

    const Message = await models.ChatMessage.create({ text: message, authorId })
    //@ts-ignore
    // Message.setAuthor(User)

    //@ts-ignore
    await Chat.addMessage(Message);

    res.json(Message)

}

export default {
    getAll,
    getById,
    getDM,
    getGroupchat,
    sendMessage,
    create
};
