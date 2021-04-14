import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const topics = await models.Group.findAll();
	res.status(200).json(topics);
};

async function create(req: Request, res: Response) {
    const { userId, logo, name, description, categories } = req.body;
    const User = await models.User.findOne({ where: { id: userId }})

    //@ts-ignore
    const group = await User.createGroup({ logo, name, description })
    res.json(group)
}

export default {
	getAll, create
};
