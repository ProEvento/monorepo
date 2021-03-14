import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const routes = {
	users: require('./routes/users').default,
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
	makeHandlerAwareOfAsyncErrors(routes.users.signupUser)
)

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
