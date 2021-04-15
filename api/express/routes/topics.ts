import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const topics = await models.Topics.findAll({ include: models.Event });
	res.status(200).json(topics);
};

async function getByTitle(req: Request, res: Response) {
    const { query } = req;
	const searchTitle = req.params.title;
	const topic = await models.Topic.findOne({
		where: {
			title: searchTitle
		}
	})
	if (topic) {
		//@ts-ignore
		res.status(200).json(topic);
	} else {
		res.status(404).json({ msg: "No topics found"});
	}
};

async function addTopicsByUser(req: Request, res: Response) {
	const id = req.query.id
	const titleString = req.query.searchTitles
	const user = await models.User.findOne({
		where: {
			id: id
		}
	})
	if (!user) {
		return res.status(400).json({msg: "User not found"})
	}
	const titles = JSON.parse(titleString as string);
	titles.forEach(async (searchTitle : any) => {
		const topic = {
			title : searchTitle,
			User_id : id
		}
		const createdTopic = await models.Topic.create(topic);
		if(!createdTopic){
			res.status(404).json({ msg: "Failed to follow topic" + {searchTitle}});
		}
	})
	res.status(200).json({ msg: "Added all topics"})
};

export default {
	getAll, getByTitle, addTopicsByUser
};
