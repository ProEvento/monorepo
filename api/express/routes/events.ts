import db from '../../sequelize'
import { getIdParam } from '../helpers'
import { EventType } from '../../types'
const { models } = db.sequelize;
import { query, Request, Response } from "express"
import { Op, useInflection } from "sequelize"

async function getAll(req: Request, res: Response) {
	const events = await models.Event.findAll({include: models.User});
	res.status(200).json(events);
};

// Gets all attending events for user, including those they're hosting
async function getEventsForUser(req: Request, res: Response) {
	const attributesToInclude = ['priv', 'title', 'description', 'createdAt', 'time', 'id']
	const userId = getIdParam(req);

	const user = await models.User.findOne({ where: {
		id: userId
	}})

	if (!user) {
		return res.status(404).json({ msg: "User not found."})
	}

	//@ts-ignore
	const hosting = await user.getHosting({ include: [ { model: models.User, as: 'host' }, { model: models.User, as: 'attendees' } ] })

	//@ts-ignore
	const attending = await user.getAttending({ include: [ { model: models.User, as: 'host' }, { model: models.User, as: 'attendees' } ] })

	const events = [
		...hosting,
		...attending
	]
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

async function leaveEvent(req: Request, res: Response) {
	const { userId } = req.body;
	const id = getIdParam(req);
	const event = await models.Event.findByPk(id);
	const user = await models.User.findByPk(userId);

	if (!event) {
		return res.status(404).json({msg: "Event not found"})
	}

	if (!user) {
		return res.status(404).json({msg: "User not found"})
	}
	//@ts-ignore
	const resp = await event.removeAttendee(user);
	res.status(200).json(resp);
}

async function joinEvent(req: Request, res: Response) {
	const { userId } = req.body;
	const id = getIdParam(req);
	const event = await models.Event.findByPk(id);
	const user = await models.User.findByPk(userId);

	console.log(event, user)

	if (!event) {
		return res.status(404).json({msg: "Event not found"})
	}

	if (!user) {
		return res.status(404).json({msg: "User not found"})
	}
	

	//@ts-ignore
	const resp = await event.addAttendee(user);
	console.log(resp)
	res.status(200).json(resp);
}

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

	const event = await models.Event.findOne({ where: { id: id }, include: [{ model: models.User, as: 'host' }]})
	//@ts-ignore
	const attendees = await event.getAttendees()

	if (attendees.length > 0) {
		//@ts-ignore
		Promise.all(attendees.map(async (attendee) => await attendee.createNotification({ text: `The event ${event.title} has been canceled by the host, ${event.host.username}` })))
	}
	await models.Event.destroy({
		where: {
			id: id
		}
	});
	res.status(200).json({ msg: "Success"});
};


export default {
	getAll,
	getById,
	create,
	update,
	remove,
	getByTitle,
	getEventsForUser,
	createEventByUser,
	joinEvent,
	leaveEvent
};
