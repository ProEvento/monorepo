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
	// items: require('./routes/<item>'),
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

app.get('/', (req, res) => {
	res.send(`
		Hello World
	`);
});

// Custom API routes
app.post(
	`/api/users/signup`,
	makeHandlerAwareOfAsyncErrors(routes.users.signupUser),
)

app.get(
	`/api/users/getByEmail`,
	makeHandlerAwareOfAsyncErrors(routes.users.getByEmail)
)

app.get(
	`/api/users/getByUsername`,
	makeHandlerAwareOfAsyncErrors(routes.users.getByUsername)
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
