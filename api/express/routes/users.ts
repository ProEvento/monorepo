import { Request, Response } from "express"
import sequelize from '../../sequelize'
import { getIdParam } from '../helpers'

const { models } = sequelize;

async function getAll(req: Request, res: Response) {
	const users = await models.User.findAll();
	res.status(200).json(users);
};

async function getById(req: Request, res: Response) {
	const id = getIdParam(req);
	const user = await models.User.findByPk(id);
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req: Request, res: Response) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.User.create(req.body);
		res.status(201).end();
	}
};

async function update(req: Request, res: Response) {
	const id = getIdParam(req);

	if (req.body.id === id) {
		await models.User.update(req.body, {
			where: {
				id: id
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
	}
};

async function remove(req: Request, res: Response) {
	const id = getIdParam(req);
	await models.User.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

export default {
	getAll,
	getById,
	create,
	update,
	remove,
};
