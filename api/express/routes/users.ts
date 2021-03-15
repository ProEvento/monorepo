import { Request, Response } from "express"
import db from '../../sequelize'
import { getIdParam } from '../helpers'
import { UserType } from '../../types'
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const users = await models.User.findAll({ include: models.Event });
	res.status(200).json(users);
};

async function signupUser(req: Request, res: Response) {
	const user: UserType = req.body;
	console.log(req.body)
	if (!user.firstName || !user.lastName) {
		return res.status(500).json({ msg: "Must provide a first and last name."}).end()
	}

	const count = await models.User.count({
		where: {
			firstName: user.firstName,
			lastName: user.lastName
		}
	})

	if (count !== 0) {
		return res.status(500).json({ msg: "User already exists"}).end()
	}

	await models.User.create(req.body);
	res.status(201).json({ msg: "success"})
};

async function getByEmail(req: Request, res: Response) {
	const { query } = req;

	console.log(query)

	if (!query.email) {
		res.status(500).json({ msg: "Email in query required"})
		return;
	}

	const user = await models.User.findOne({ where: { email: query.email }});

	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).json({ msg: "User not found."});
	}
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
	signupUser,
	getByEmail,
	remove,
};
