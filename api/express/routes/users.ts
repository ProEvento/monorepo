import { Request, Response } from "express"
import db from '../../sequelize'
import { Op } from "sequelize"
import { getIdParam } from '../helpers'
import { UserType, GroupType, Suggestion } from '../../types'
import suggestions from "./suggestions"
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
	const u = await models.User.create(req.body);
	res.status(201).json({ msg: "success", user: u})
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
};

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
};

async function getUsersBadges(req: Request, res: Response) {
	const { id } = req.query;
	const user = await models.User.findOne({where: { id: id }})
	if (user) {
		//@ts-ignore
		res.status(200).json(await user.getBadges())
	} else {
		res.status(400).json({msg: "User not found."})
	}
};

async function addBadgeToUser(req: Request, res: Response) {
	const { host, text, img } = req.query;
	// print(req.)
	// res.status(200).json(text);
	const user = await models.User.findOne({where: { id: host }})
	if (user) {
		//@ts-ignore
		const badge = await user.createBadge({ name: text, img: img })
		res.status(200).json(badge);
	} else {
		res.status(400).json({msg: "User not found."})
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
	// await models.User.destroy({
	// 	where: {
	// 		id: id
	// 	}
	// });
	const user = await models.User.findOne({where: { id: id }})

	if (user) {
		const deletedUser = await user.update({deleted : true})
	}
	

	res.status(200).end();
};

async function convertSuggestion(req: Request, res: Response) {

	/*
     Query
      - Check for all the times in groups and see if any have just passed
          - Yes-> Find all suggestions that are active.
              - Grab 3 with most votes
                  - Convert to events
                      - Send notifications to all group members
     */
	const id = getIdParam(req);
	const user = await models.User.findOne({where: { id: id }})

	// Get groups for user
	//@ts-ignore
	const Groups = await user.getGroups({ include: [{ model: models.User, as: "owner" }, { model: models.User, as: "users"}, { model: models.GroupCategory, as: "categories"} ] });

	for (let group of Groups) {		
		//@ts-ignore
		let pollTime = new Date(group.pollTime)

		// If within 1 min
		if (pollTime.getTime() > Date.now() && pollTime.getTime() - 600000 < Date.now()) {
			// Find suggestions that are active
			const suggestions = await models.Suggestion.findAll({
				// where: { Group_id: id}
				where: { 
					[Op.and]: [
					{
						//@ts-ignore
						Group_id: group.id
					}, 
					{
						active: "1"
					}, 
				]},
				order: [
					['votes', 'DESC']
				]
			});
			if (suggestions.length) {
				for (let i  = 0; i < suggestions.length; i++) {
					// Set as winners and convert to an event and notify
					if (i < 3) {
						// Set as winner
						//@ts-ignore
						await suggestions[i].update({winner: true})

						// Convert to event
						const newEvent = {
							//@ts-ignore
							title: suggestions[i].name,
							//@ts-ignore
							description: suggestions[i].description,
							//@ts-ignore
							priv: false,
							//@ts-ignore
							hashtags: [],
							//@ts-ignore
							picture : "",
							//@ts-ignore
							time: (new Date(suggestions[i].time)).toISOString(),
							//@ts-ignore
							User_id: group.User_id.toString()
						}

						// Add event
						//@ts-ignore
						const eventAdded = await models.Event.create(newEvent)

						// Set topic
						//@ts-ignore
						await eventAdded.update({topic: suggestions[i].topic})

						// Notification
						//@ts-ignore
						const users = await group.getUsers()
						for (const user of users) {
							//@ts-ignore
							//@ts-ignore
							await user.createNotification({ text: `${suggestions[i].name} has won the voting for ${group.name}! Click <a href="http://localhost:3000/event/${eventAdded.id}">Here</a> to check out the event!` })
						}
					}
					//@ts-ignore
					await suggestions[i].update({active: false})
				}

				// Update
				pollTime.setTime(pollTime.getTime() + 604800000)
				await group.update({pollTime: pollTime.toString()})
			}

			
		}
	}
	res.status(200).end();
};



export default {
	convertSuggestion,
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
	addNotificationToUser,
	addBadgeToUser,
	getUsersBadges
};
