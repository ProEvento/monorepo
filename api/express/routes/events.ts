import db from '../../sequelize'
import { getIdParam } from '../helpers'
import { EventType } from '../../types'
const { models } = db.sequelize;
import { query, Request, Response } from "express"
import { Op } from "sequelize"

async function getAll(req: Request, res: Response) {
	const events = await models.Event.findAll({include: models.User});
	res.status(200).json(events);
};

async function getById(req: Request, res: Response) {
	const id = getIdParam(req);
	const user = await models.Event.findByPk(id);
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByTitle(req: Request, res: Response) {
	const { query } = req;

	if (!query.title) {
		res.status(500).json({ msg: "Title in query required"})
		return;
	}
	
	const user = await models.Event.findOne({ where: { title: query.title }});
	
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).json({ msg: "User not found."});
	}
};

async function create(req: Request, res: Response) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.Event.create(req.body);
		res.status(201).end();
	}
};

async function update(req: Request, res: Response) {
	const id = getIdParam(req);
	if (req.body.id === id) {
		await models.Event.update(req.body, {
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
	await models.Event.destroy({
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
	getByTitle
};
