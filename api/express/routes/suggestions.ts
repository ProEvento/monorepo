import { query, Request, Response } from "express"
import db from '../../sequelize'
import { getIdParam } from "../helpers";
const { models } = db.sequelize;
import { Model, Op, useInflection } from "sequelize"

async function getAll(req: Request, res: Response) {
	const Suggestions = await models.Suggestion.findAll();
	res.status(200).json(Suggestions);
};

async function getActiveSuggestions(req: Request, res: Response) {
    const id = req.query.id;
	const Suggestions = await models.Suggestion.findAll({
        // where: { Group_id: id}
        where: { 
            [Op.and]: [
            {
                Group_id: id
            }, 
            {
                active: "1"
            }, 
        ]}
	});
	res.status(200).json(Suggestions);
};

async function vote(req: Request, res: Response) {
    const id = req.query.id
    const suggestion = await models.Suggestion.findOne({where: {id: id}});

	if (suggestion) {
        const incrementResult = await suggestion.increment('votes', { by: 1 });
    }
	res.status(200).json(suggestion);
};



async function createSuggestion(req: Request, res: Response) {

    const {name, id, description,group_id, topicName, time } = req.query;
    JSON.stringify(name)
    JSON.stringify(id)
    JSON.stringify(description)
    JSON.stringify(group_id)
    JSON.stringify(time);
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
    await models.Suggestion.create({name: name, User_id: id, time: time, description: description, Group_id: group_id, Topic_id: topic_id});
    res.status(201).json({msg: "success"});
    
};


export default {
    getAll,
    createSuggestion,
    getActiveSuggestions,
    vote
};
