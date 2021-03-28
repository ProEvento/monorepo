import { query, Request, Response } from "express"
import db from '../../sequelize'
import { Op } from "sequelize"
import { getIdParam } from '../helpers'
import { UserType } from '../../types'
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const users = await models.User.findAll({ include: [{model: models.Event, as: 'attending'}] });
	res.status(200).json(users);
};

async function signupUser(req: Request, res: Response) {
	const user: UserType = req.body;
	if (!user.firstName || !user.lastName) {
		return res.status(500).json({ msg: "Must provide a first and last name."}).end()
	}

	const count = await models.User.count({
		where: {
			[Op.or]: [
				{
					email: 
					{
						[Op.eq]: user.email
					}
				}, 
				{
					username: 
					{
						[Op.eq]: user.username
					}
				}, 
			]
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

async function getNotificationsForUser(req: Request, res: Response) {
	const id = getIdParam(req);

	const user = await models.User.findOne({where: { id: id }})
	if (user) {
		//@ts-ignore
		res.status(200).json(await user.getNotifications())
	} else {
		res.status(400).json({msg: "User not found."})
	}
}

async function addNotificationToUser(req: Request, res: Response) {
	const id = getIdParam(req);
	
	const { text } = req.query;

	const user = await models.User.findOne({where: { id: id }})
	if (user) {
		//@ts-ignore
		const notification = await user.createNotification({ text: text })
		res.status(200).json(notification);
	} else {
		res.status(400).json({msg: "User not found."})
	}
}

async function getById(req: Request, res: Response) {
	const id = getIdParam(req);
	const user = await models.User.findByPk(id);
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByUsername(req: Request, res: Response) {
	const { query } = req;

	if (!query.username) {
		res.status(500).json({ msg: "Username in query required"})
		return;
	}
	
	const user = await models.User.findOne({ where: { username: query.username }});
	
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404).json({ msg: "User not found."});
	}
};

async function getTopics(req: Request, res: Response) {
	const { query } = req;
	const id = getIdParam(req);
	const topics = await models.Topic.findAll({
		where: {
			User_id: id
		}
	})
	if (topics) {
		//@ts-ignore
		res.status(200).json(topics);
		//user.addNotification()
	} else {
		res.status(404).json({ msg: "No topics found"});
	}
};

async function getFollowers(req: Request, res: Response) {
	const { query } = req;
	const id = getIdParam(req);
	const user = await models.User.findOne({
		where: {
			id: id
		}
	})
	if (user) {
		//@ts-ignore
		res.status(200).json(await user.getFollowing());
		//user.addNotification()
	} else {
		res.status(404).json({ msg: "User not not found."});
	}
};

async function getFollowing(req: Request, res: Response) {
	const { query } = req;
	
	const id = getIdParam(req);
	const user = await models.User.findOne({
		where: {
			id: id
		}
	})
	if (user) {
		//@ts-ignore
		res.status(200).json(await user.getFollowers());
	} else {
		res.status(404).json({ msg: "User not not found."});
	}
};

async function removeFollower(req: Request, res: Response) {
	const { userfollowed, unfollower} = req.query;

	const unfollowerUser = await models.User.findOne({
		where: {
			username: unfollower
		}
	})

	const userfollowedUser = await models.User.findOne({
		where: {
			username: userfollowed
		}
	})

	if (unfollowerUser && userfollowedUser) {
		//@ts-ignore
		res.status(200).json(await userfollowedUser.removeFollowing(unfollowerUser));
	} else {
		res.status(404).json({ msg: "User not found."});
	}
};

async function addFollower(req: Request, res: Response) {
	const { userfollowed, follower} = req.query;

	const followerUser = await models.User.findOne({
		where: {
			username: follower
		}
	})

	const followedUser = await models.User.findOne({
		where: {
			username: userfollowed
		}
	})
	if (followerUser && followedUser) {
		//@ts-ignore
		res.status(200).json(await followedUser.addFollowing(followerUser));
	} else {
		res.status(404).json({ msg: "User not found."});
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
	getByUsername,
	getFollowers,
	getFollowing,
	getTopics,
	removeFollower,
	addFollower,
	create,
	update,
	signupUser,
	getByEmail,
	remove,
	getNotificationsForUser,
	addNotificationToUser
};
