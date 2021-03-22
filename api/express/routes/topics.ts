import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const topics = await models.Topics.findAll();
	res.status(200).json(topics);
};

export default {
	getAll,
};
