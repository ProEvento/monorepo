import { Request, Response } from "express"
import db from '../../sequelize'
import { getIdParam } from '../helpers'
import { EventType } from '../../types'
const { models } = db.sequelize;
import { Op, useInflection } from "sequelize"

async function getAll(req: Request, res: Response) {
	const events = await models.Event.findAll({include: models.User});
	res.status(200).json(events);
};

// Gets all attending events for user, including those they're hosting
async function getEventsForUser(req: Request, res: Response) {
	const userId = getIdParam(req);

	const user = await models.User.findOne({ where: {
		id: userId
	}})

	if (!user) {
		return res.status(404).json({ msg: "User not found."})
	}

	//@ts-ignore
	const hosting = await user.getHosting({ as: "hosting"})
	console.log(hosting)
	//@ts-ignore
	const attending = await user.getAttending({ as: "attending"})
	const events = {
		...hosting,
		...attending
	}
	//@ts-ignore
	console.log()
	//@ts-ignore
	res.status(200).json(events);
};

async function getById(req: Request, res: Response) {
	const id = getIdParam(req);
	const events = await models.Event.findByPk(id, {include: models.User});

	if (events) {
		res.status(200).json(events);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function createEventByUser(req: Request, res: Response) {
	const { userId, ...event } = req.body;
	console.log(req.body)
	const user = await models.User.findOne({ where: {
		id: userId
	}});

	if (!user) {
		return res.status(400).json({msg: "User not found"})
	}

	if (req.body.id) {
		res.status(400).json({msg: `Bad request: ID should not be provided, since it is determined automatically by the database.`})
	} else {
		const createdEvent = await models.Event.create(event);

		//@ts-ignore
		await user.addAttending(createdEvent);
		res.status(201).end();
	}
}

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
	getEventsForUser,
	createEventByUser
};
