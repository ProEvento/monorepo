import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

// Twilio
import { jwt } from 'twilio';

const { AccessToken } = jwt;
const VideoGrant = AccessToken.VideoGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

require('dotenv').config({ path: '.env.local' })

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY_SID || !process.env.TWILIO_API_KEY_SECRET) {
	throw new Error("Missing required Twilio API keys in api/.env.local")
}
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const routes = {
	users: require('./routes/users').default,
	events: require('./routes/events').default,
	search: require('./routes/search').default,
	// items: require('./routes/<item>').default,
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function makeHandlerAwareOfAsyncErrors(handler: Function) {
	return async function(req: Request, res: Response, next: NextFunction) {

		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

async function handleProeventoSecret (req: Request, res: Response, next: NextFunction) {
	const secret = req.headers.authorization;
	if (secret === process.env.PROEVENTO_SECRET) {
		next()
	} else {
		throw new Error('Not authorized.')
	}
}

app.use(handleProeventoSecret);

app.get('/', (req, res) => {
	res.send(`
		Hello World
	`);
});

// Custom API routes

// Search

app.get(
	`/api/search/:type`,
	makeHandlerAwareOfAsyncErrors(routes.search.search)
)

// Users

app.post(
	`/api/users/signup`,
	makeHandlerAwareOfAsyncErrors(routes.users.signupUser),
)
app.get(
	`/api/users/followers/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.getFollowers)
)
app.get(
	`/api/users/following/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.getFollowing)
)
app.delete(
	`/api/users/removeFollower`,
	makeHandlerAwareOfAsyncErrors(routes.users.removeFollower)
)
app.put(
	`/api/users/addFollower`,
	makeHandlerAwareOfAsyncErrors(routes.users.addFollower)
)

app.get(
	`/api/users/getByEmail`,
	makeHandlerAwareOfAsyncErrors(routes.users.getByEmail)
)

app.get(
	`/api/users/getByUsername`,
	makeHandlerAwareOfAsyncErrors(routes.users.getByUsername)
)

app.get(
	`/api/users/topics/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.getTopics)
)

app.get(
	`/api/users/notifications/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.getNotificationsForUser)
)

app.post(
	`/api/users/notifications/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.addNotificationToUser)
)

// Events

app.get(
	`/api/events/getEventsForUser/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventsForUser)
)

app.get(
	`/api/events/getEventAttendees/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventAttendees)
)

app.get(
	`/api/events/getAttending/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventsAttending)
)

app.post(
	`/api/events/createEventByUser`,
	makeHandlerAwareOfAsyncErrors(routes.events.createEventByUser)
)

app.post(
	`/api/events/joinEvent/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.joinEvent)
)

app.post(
	`/api/events/leaveEvent/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.leaveEvent)
)

app.get(
	`/api/events/getByTitle`,
	makeHandlerAwareOfAsyncErrors(routes.events.getByTitle)
)

app.put(
	`/api/events/startEvent`,
	makeHandlerAwareOfAsyncErrors(routes.events.startEvent)
)

app.put(
	`/api/events/endEvent`,
	makeHandlerAwareOfAsyncErrors(routes.events.endEvent)
)




// Twilio token
app.get('/api/token', (req, res) => {
	const { username, room } = req.query;
	const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
	  ttl: MAX_ALLOWED_SESSION_DURATION,
	});
	//@ts-expect-error
	token.identity = username;
	let videoGrant;
	if (typeof room !== 'undefined') {
	  //@ts-ignore
	  videoGrant = new VideoGrant({ room });
	} else {
	  videoGrant = new VideoGrant();
	}
	token.addGrant(videoGrant);
	res.send(token.toJwt());
	console.log(`Issued token for ${username} in room ${room}`);
});

// Define REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getAll) {
		app.get(
			`/api/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	}
	if (routeController.getById) {
		app.get(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	}

	if (routeController.create) {
		app.post(
			`/api/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}

	if (routeController.update) {
		app.put(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
}


export default app
