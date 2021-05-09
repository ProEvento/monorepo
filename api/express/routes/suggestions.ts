import { query, Request, Response } from "express"
import db from '../../sequelize'
import { getIdParam } from "../helpers";
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const Suggestions = await models.Suggestion.findAll();
	res.status(200).json(Suggestions);
};

async function getById(req: Request, res: Response) {
    const id = getIdParam(req);
	const Suggestion = await models.Suggestion.findByPk(id);
	if (!Suggestion) {
        return res.status(404).json({ msg: "Group not found."})
    }
    res.status(200).json(Suggestion);
};

async function createSuggestion(req: Request, res: Response) {

    const {name, id, description,group_id, topicName } = req.query;
    JSON.stringify(name)
    JSON.stringify(id)
    JSON.stringify(description)
    JSON.stringify(group_id)
    // JSON.stringify(Topic_id)

	// const searchTitle = req.query.searchTitle
    
	const topic = await models.Topic.findOne({
		where: {
			title: topicName
		}
    })
    
    if(topic){

    } else {
        res.status(201).json({msg: "topic not found"});
    }

    const topic_id = topic.id
    console.log("topic id", topic_id)
    await models.Suggestion.create({name: name, User_id: id, time: "2021-03-19 10:43:58", description: description, Group_id: group_id, Topic_id: topic_id});
    res.status(201).json({msg: "success"});
    
};


export default {
    getAll,
    getById,
    createSuggestion
};
