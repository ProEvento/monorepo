import { query, Request, Response } from "express"
import db from '../../sequelize'
import { getIdParam } from "../helpers";
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const Groups = await models.Group.findAll({ include: [{ model: models.User, as: "owner" }, { model: models.User, as: "users"},  { model: models.GroupCategory, as: "categories"}]});
	res.status(200).json(Groups);
};

async function getById(req: Request, res: Response) {
    const id = getIdParam(req);
	const Group = await models.Group.findByPk(id, { include: [{ model: models.User, as: "owner" }, { model: models.User, as: "users"},  { model: models.GroupCategory, as: "categories"}]});
	if (!Group) {
        return res.status(404).json({ msg: "Group not found."})
    }
    res.status(200).json(Group);
};



async function create(req: Request, res: Response) {
    const { creatorId, userIds, logo, name, description, categories: categoriesString } = req.query;
    console.log("req.body", req.query)
    if (!name || !description || !creatorId) {
        return res.status(400).json({msg: "Missing required field."});
    }

    const Creator = await models.User.findOne({ where: { id: creatorId }})

    //@ts-ignore
    const Group = await models.Group.create({ logo, name, description })

    //@ts-ignore
    await Group.setOwner(Creator);
    //@ts-ignore
    await Group.addUser(Creator);
    if (Array.isArray(userIds)) {
        console.log(userIds)
        for (const id of userIds) {
            const User = await models.User.findOne({ where: { id: id }})

            //@ts-ignore
            await Group.addUser(User)
        }
    }

    //@ts-ignore
    const categories = categoriesString.split(",") 
    if (categories.length > 0) {
        console.log(categories)
        for (const category of categories) {
            const FoundCategory = await models.GroupCategory.findByPk(category)
            //@ts-ignore
            await Group.addCategory(FoundCategory)
        }
        
    }

    //@ts-ignore
    const FinalGroup = await models.Group.findByPk(Group.id, { include: [{ model: models.User, as: "owner" }, { model: models.User, as: "users"}, { model: models.GroupCategory, as: "categories"}]})

    res.json({ msg: "success", group: FinalGroup })
}

async function getCategories(req: Request, res: Response) {
    const Categories = await models.GroupCategory.findAll();
    res.json(Categories);
}

async function getGroupsForUser(req: Request, res: Response) {
    const { userId } = req.query;
    //@ts-ignore
    const User = await models.User.findByPk(parseInt(userId)) 
    if (!User) {
        return res.status(404).json({ message: "User not found."})
    }

    console.log(User)

    //@ts-ignore
    const Groups = await User.getGroups();

    return res.json(Groups);
}

async function remove(req: Request, res: Response) {
	const id = getIdParam(req);
	await models.Group.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

async function addUserToGroup(req: Request, res: Response) {
	const { userId, groupId } = req.query;
    //@ts-ignore
	const User = await models.User.findByPk(userId);
    //@ts-ignore
    const Group = await models.Group.findByPk(groupId);

    //@ts-ignore
    if (await Group.hasUser(User)) {
        return res.status(400).json({ msg: "User already in group"});
    } else {
        //@ts-ignore
        await Group.addUser(User);
        return res.status(200).json({ msg: "success"})
    }
};

async function removeUserFromGroup(req: Request, res: Response) {
	const { userId, groupId } = req.query;
    //@ts-ignore
	const User = await models.User.findByPk(userId);
    //@ts-ignore
    const Group = await models.Group.findByPk(groupId);

    //@ts-ignore
    if (await Group.hasUser(User)) {
        //@ts-ignore
        await Group.removeUser(User);
        return res.status(200).json({ msg: "success"})
    } else {
        return res.status(400).json({ msg: "User not in group"});
    }
};

export default {
    getCategories,
	getAll,
    create,
    getGroupsForUser,
    getById,
    remove,
    addUserToGroup,
    removeUserFromGroup
};
