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

export default {
	getAll, getByTitle
};
