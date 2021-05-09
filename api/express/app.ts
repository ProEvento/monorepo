import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

// Twilio
import { jwt, Twilio } from 'twilio';

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
const TwilioClient = new Twilio(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid })

const routes = {
	users: require('./routes/users').default,
	events: require('./routes/events').default,
	search: require('./routes/search').default,
	topics: require('./routes/topics').default,
	groups: require('./routes/groups').default,
	chats: require('./routes/chat').default,
	hashtags: require('./routes/hashtags').default,
	suggestions: require('./routes/suggestions').default,
	// items: require('./routes/<item>').default,
};

const app = express();

app.use(express.json());

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
		res.status(500).send("Not authorized.")
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
app.delete(
	`/api/users/delete/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.remove)
)

app.post(
	`/api/users/reactivate/:id`,
	makeHandlerAwareOfAsyncErrors(routes.users.reactivate)
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

app.post(
	`/api/users/badges`,
	makeHandlerAwareOfAsyncErrors(routes.users.addBadgeToUser)
)

app.get(
	`/api/users/badges`,
	makeHandlerAwareOfAsyncErrors(routes.users.getUsersBadges)
)


// Events

app.get(
	`/api/events/getEventsForUser/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventsForUser)
)

app.put(
	`/api/events/setHost`,
	makeHandlerAwareOfAsyncErrors(routes.events.setTwilioHostId)
)

app.get(
	`/api/events/getHostRecording`,
	makeHandlerAwareOfAsyncErrors(routes.events.getHostRecording)
)

app.post(
	`/api/events/sendHostRecording`,
	makeHandlerAwareOfAsyncErrors(routes.events.sendHostRecording)
)

app.get(
	`/api/events/getEventAttendees/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventAttendees)
)

app.get(
	`/api/events/getAttending/:id`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventsAttending)
)

app.get(
	`/api/events/hashtag`,
	makeHandlerAwareOfAsyncErrors(routes.events.getEventHashtags)
)

app.post(
	`/api/events/hashtag`,
	makeHandlerAwareOfAsyncErrors(routes.events.addHashtag)
)

app.post(
	`/api/events/record`,
	makeHandlerAwareOfAsyncErrors(routes.events.setRecord)
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

app.post(
	`/api/events/setTopic`,
	makeHandlerAwareOfAsyncErrors(routes.events.addTopic)
)

app.get(
	`/api/events/getUserGroupEvents`,
	makeHandlerAwareOfAsyncErrors(routes.events.getUserGroupEvents)
)

app.get(
	`/api/events/getUserTopicEvents`,
	makeHandlerAwareOfAsyncErrors(routes.events.getUserTopicEvents)
)

// Topics

app.get(
	`/api/topics/getByTitle/:title`,
	makeHandlerAwareOfAsyncErrors(routes.topics.getByTitle)
)

app.post(
	`/api/topics/addTopicsByUser`,
	makeHandlerAwareOfAsyncErrors(routes.topics.addTopicsByUser)
)

// Groups

app.get(
	`/api/groups/getCategories`,
	makeHandlerAwareOfAsyncErrors(routes.groups.getCategories)
)

app.get(
	`/api/groups/getGroupsForUser`,
	makeHandlerAwareOfAsyncErrors(routes.groups.getGroupsForUser)
)

app.post(
	`/api/groups/addUserToGroup`,
	makeHandlerAwareOfAsyncErrors(routes.groups.addUserToGroup)
)

app.post(
	`/api/groups/removeUserFromGroup`,
	makeHandlerAwareOfAsyncErrors(routes.groups.removeUserFromGroup)
)

// Suggestions

app.post(
	`/api/groups/createSuggestion`,
	makeHandlerAwareOfAsyncErrors(routes.suggestions.createSuggestion)
)

app.get(
	`/api/groups/getActiveSuggestions`,
	makeHandlerAwareOfAsyncErrors(routes.suggestions.getActiveSuggestions)

)

// Chat

app.post(
	`/api/chats/sendMessage/:id`,
	makeHandlerAwareOfAsyncErrors(routes.chats.sendMessage)
)
app.get(
	`/api/chats/getDM/:id`,
	makeHandlerAwareOfAsyncErrors(routes.chats.getDM)
)

app.get(
	`/api/chats/getGroupchat/:id`,
	makeHandlerAwareOfAsyncErrors(routes.chats.getGroupchat)
)

// Hashtag

app.post(
	`/api/hashtags/addHashtagsByEvent`,
	makeHandlerAwareOfAsyncErrors(routes.hashtags.addHashtagsByEvent)
)


// Twilio

app.get('/api/twilio/token', (req, res) => {
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