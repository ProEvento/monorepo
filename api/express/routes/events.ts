import db from '../../sequelize'
import { getIdParam } from '../helpers'
import { EventType } from '../../types'
const { models } = db.sequelize;
import { query, Request, Response } from "express"
import { Model, Op, useInflection } from "sequelize"
import { createDecipher } from 'crypto';
import Events from 'twilio/lib/rest/Events';
import { Twilio } from 'twilio';
require('dotenv').config({ path: '.env.local' })
import request from "request";

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

	const { attending } = req.query
	if (!attending) {
		const event = await models.Event.findByPk(id, { include: [{ model: models.User, as: "host" }, {model: models.Topic}, {model: models.Hashtag}]});
		if (event) {
			res.status(200).json(event);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else {
		const event = await models.Event.findByPk(id, { include: [{ model: models.User, as: "host" }, {model: models.User, as: "attendees" }, {model: models.Topic}, {model: models.Hashtag}]});
		//console.log(event ? event.toJSON() : "event is nyull")
		if (event) {
			res.status(200).json(event);
		} else {
			res.status(404).send('404 - Not found');
		}
	}

};

async function startEvent(req: Request, res: Response) {
	const id = req.query.id;
	if (!id) {
		throw new Error("Missing id")
	}
	//@ts-ignore
	const event = await models.Event.findByPk(id);
	//@ts-ignore
	//console.log(id, event.title)
	//@ts-ignore
	const attendees = await event.getAttendees();
	for (const user of attendees) {
		//@ts-ignore
		await user.createNotification({text: "Your event " + event.title + " is starting now! Join here: <a href='/event/" + event.id + "'>click me</a>"});
	}
	if (event) {
		//@ts-ignore
		const dateEvent = new Date(event.time)
		if(Date.now() >= dateEvent.getTime()){
			// @ts-ignore
			event.started = true
			await event.save();
			res.status(200).json(event);
		}
		else {
			res.status(400).json({msg: 'Cannot start event before start time'});
		}
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function endEvent(req: Request, res: Response) {
	const id = req.query.id;
	if (!id) {
		throw new Error("Missing id")
	}
	//@ts-ignore
	const event = await models.Event.findByPk(id);
	if (event) {
		// @ts-ignore
		event.ended = true
		await event.save();
		res.status(200).json(event);
	} else {
		res.status(404).send('404 - Not found');
	}
};


async function leaveEvent(req: Request, res: Response) {
	const { userId } = req.query;
	const id = getIdParam(req);
	const event = await models.Event.findByPk(id, { include: [{model: models.User, as: "host"}]});
	const user = await models.User.findOne({where: {id: userId}});

	if (!event) {
		return res.status(404).json({msg: "Event not found"})
	}

	if (!user) {
		return res.status(404).json({msg: "User not found"})
	}

	//@ts-ignore
	await event.host.createNotification({ text: `${user.username} has said they're no longer attending ${event.name}`})

	//@ts-ignore
	const resp = await event.removeAttendee(user);
	res.status(200).json({ msg: "success"});
}

async function joinEvent(req: Request, res: Response) {
	const { userId } = req.query;
	const id = getIdParam(req);
	const event = await models.Event.findByPk(id, { include: [{model: models.User, as: "host"}]});
	const user = await models.User.findOne({where: {id: userId}});

	if (!event) {
		return res.status(404).json({msg: "Event not found"})
	}

	if (!user) {
		return res.status(404).json({msg: "User not found"})
	}
	
	//@ts-ignore
	await event.host.createNotification({ text: `${user.username} has said they're attending ${event.name}`})

	//@ts-ignore
	const resp = await event.addAttendee(user);
	res.status(200).json({ msg: "success"});
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
	const { userId, ...event } = req.query;
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

		res.status(201).json({ msg: "success", event: createdEvent } );
	}
}
async function getEventsAttending(req: Request, res: Response) {
	const { query } = req;
	const id = getIdParam(req);
	const user = await models.User.findOne({
		where: {
			id: id
		}
	})
	if (user) {
		//@ts-ignore
		res.status(200).json(await user.getAttending());
	} else {
		res.status(404).json({ msg: "User not not found."});
	}
};

async function getEventAttendees(req: Request, res: Response) {
	const { query } = req;
	const id = getIdParam(req);
	//console.log("in geteventattendee ", id)
	const event = await models.Event.findOne({
		where: {
			id: id
		}
	});
	if (event) {
		//@ts-ignore
		res.status(200).json(await event.getAttendees());
	} else {
		res.status(404).json({ msg: "Event not not found."});
	}
};

async function addTopic(req: Request, res: Response) {
	const id = req.query.id
	const searchTitle = req.query.searchTitle
	const event = await models.Event.findOne({
		where: {
			id: id
		}
	})

	const topic = await models.Topic.findOne({
		where: {
			title: searchTitle
		}
	})

	if (event && searchTitle) {
		//@ts-ignore
		res.status(200).json(await topic.addEvent(event));
	} else {
		res.status(404).json({ msg: "Topic or Event not found."});
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

	const event = await models.Event.findOne({ where: { id: id }, include: [{ model: models.User, as: 'host' }]})
	//@ts-ignore
	const attendees = await event.getAttendees()

	if (attendees.length > 0) {
		//@ts-ignore
		Promise.all(attendees.map(async (attendee) => attendee.username === event.host.username ? await attendee.createNotification({ text: `You canceled ${event.title}`}) : await attendee.createNotification({ text: `The event ${event.title} has been canceled by the host, ${event.host.username}` })))
	}
	await models.Event.destroy({
		where: {
			id: id
		}
	});
	res.status(200).json({ msg: "Success"});
};

async function getUserGroupEvents(req: Request, res: Response) {
	const userId = getIdParam(req);
	const user = await models.User.findOne({ where: {
		id: userId
	}})
	if (!user) {
		return res.status(404).json({ msg: "User not found."})
	}

	//@ts-ignore
	const groups = await user.getGroups({ include: [{ model: models.User, as: "users", include: { model: models.Event, as: "hosting", include: [{ model: models.User, as: "attendees"}, { model: models.User, as: "host"}]}}]});

	var events: any[] = [];
	for (const group of groups) {
		for (const u of group.users){
			if (u.id != userId){
				events = [...events, ...u.hosting]
			}
		}
    }
	res.status(200).json(events);
};

async function getUserTopicEvents(req: Request, res: Response) {
	const userId = getIdParam(req);
	const user = await models.User.findOne({ where: {
		id: userId
	}})
	if (!user) {
		return res.status(404).json({ msg: "User not found."})
	}
	var result: any[] = [];
	//@ts-ignore
	const topics = await user.getTopics()
	const events = await models.Event.findAll({include: [{ model: models.User, as: "attendees"}, { model: models.User, as: "host"}, { model: models.Topic, as: "Topic"}]});
	for (const topic of topics){
		for (const event of events){
			//@ts-ignore
			if (event.Topic && topic.title === event.Topic.title){
				//@ts-ignore
				if (event.host && event.host.id != userId){
					result.push(event)
				}
			}
		}
	}

	res.status(200).json(result);
};

async function getEventHashtags(req: Request, res: Response) {
	const { id } = req.query;
	const event = await models.Event.findOne({where: { id: id }})
	if (event) {
		//@ts-ignore
		res.status(200).json(await event.getHashtags())
	} else {
		res.status(400).json({msg: "Event not found."})
	}
};

async function addHashtag(req: Request, res: Response) {
	const { id, text } = req.query;
	// print(req.)
	// res.status(200).json(text);
	const event = await models.Event.findOne({
		where: {
			id: id
		}
	})
	if (event) {
		//@ts-ignore
		const hashtag = await event.createHashtag({ title: text})
		res.status(200).json(hashtag);
	} else {
		res.status(400).json({msg: "Event not found."})
	}
};


async function setRecord(req: Request, res: Response) {
	const { id, record } = req.query;
	// print(req.)
	// res.status(200).json(text);
	const event = await models.Event.findOne({
		where: {
			id: id
		}
	})
	if (event) {
		//@ts-config
		console.log("record: ", record)
		console.log("event before : ", event)
		//@ts-ignore
		const eventRecord = await event.update({record : record})

		//@ts-config
		console.log("event after : ", event)

		res.status(200).json(eventRecord);
	} else {
		res.status(404).json({msg: "Event not found."})
	}
};

async function setTwilioHostId(req: Request, res: Response) {
	const { id, roomId } = req.query;
	// print(req.)
	// res.status(200).json(text);
	const event = await models.Event.findOne({
		where: {
			id: id
		}
	})

	if (event) {
		const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
		const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;	
		const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
		//@ts-ignore
		const client = new Twilio(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid })

		//@ts-ignore
		client.video.rooms(roomId).participants
			.each({status: 'connected'}, async (participant) => {
				const hostId = participant.sid;
				event.update({ hostTwilioId: hostId, roomTwilioId: roomId })
			});

		res.status(200).json({msg: "Success"});
	} else {
		res.status(404).json({msg: "Event not found."})
	}
};

async function getHostRecording(req: Request, res: Response) {
	const { id } = req.query;
	const event = await models.Event.findByPk(id.toString())

	if (!event) {
		return res.status(404).json({msg: "Event not found."})
	}

	const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
	const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;	
	const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
	//@ts-ignore
	const client = new Twilio(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid })

	//@ts-ignore
	const recordings = await client.video.recordings.list({groupingSid: [event.hostTwilioId], limit: 20})
	const videoRecordings = new Array();
	const audioRecordings = new Array();
	for (const recording of recordings) {
		const uri =
			"https://video.twilio.com/v1/" +
			//@ts-ignore
			`Rooms/${event.roomTwilioId}/` +
			`Recordings/${recording.sid}` +
			"/Media";

		const res = await client.request({ method: "GET", uri: uri });
		const mediaLocation = res.body.redirect_to;

		if (recording.type === "video") {
			videoRecordings.push({ url: mediaLocation, speaker: recording.groupingSids.participant_sid })
		} else if (recording.type === "audio") {
			audioRecordings.push({ url: mediaLocation, speaker: recording.groupingSids.participant_sid })
		}
	}


	res.json({ videoRecordings, audioRecordings })
}

async function sendHostRecording(req: Request, res: Response) {
	const { id } = req.query
	const event = await models.Event.findByPk(id.toString(), { include: [{model: models.User, as: "host"}, {model: models.User, as: "attendees"}]})

	//@ts-ignore
	for (const attendee of event.attendees) { 
		//@ts-ignore
		await attendee.createNotification({text: `You've been sent the recordings to ${event.title}: <a href="/recording/${event.id}">click here.</a>`})
	}

	//@ts-ignore
	const host = event.host;
	//@ts-ignore
	await host.createNotification({text: `<a href="/recording/${event.id}">Click here to view your recording for ${event.title}.</a>`})
}

export default {
	getAll,
	getById,
	create,
	update,
	remove,
	getByTitle,
	getEventsAttending,
	getEventsForUser,
	getUserGroupEvents,
	getUserTopicEvents,
	createEventByUser,
	joinEvent,
	leaveEvent,
	startEvent,
	endEvent,
	addTopic,
	addHashtag,
	getEventHashtags,
	setRecord,
	setTwilioHostId,
	getHostRecording,
	sendHostRecording
};
