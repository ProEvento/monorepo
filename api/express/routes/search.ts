
import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;
import { Model, Op, useInflection } from "sequelize"

async function search(req: Request, res: Response) {
    // type: "event" | "user",
    const { type } = req.params
	// query: string comma seperated terms, sort: "ascending" | "descending"
	const { query, sort }  = req.query

    if (!query || typeof query !== 'string') {
        res.status(500).json({ msg: "Requires query"})
    }

	const terms = query!.toString().split(",")
    console.log(`%${terms}%`)
	if (type === "user") {
		const results = await models.User.findAll({
			where: { 
				[Op.or]: [
				{
					email: 
					{
						[Op.like]: `%${terms}%`
					}
				}, 
				{
					username:
					{
						[Op.like]: `%${terms}%`
					}
				}, 
				{
					firstName: 
					{
						[Op.like]: `%${terms}%`
					}
				}, 
				{
					lastName: 
					{
						[Op.like]: `%${terms}%`
					}
				},
			]}
		})
		res.status(200).json({results});
	} else if (type === "event") {
		const results = await models.Event.findAll({
			order: [
				['time', sort === "ascending" ? "ASC" : "DESC"]
			],
			include: [{ model: models.User, as: "host"}, { model: models.User, as: "attendees"}],
			where: { 
				[Op.or]: [
				{
					title: 
					{
						[Op.like]: `%${terms}%`
					}
				}, 
				{
					description: 
					{
						[Op.like]: `%${terms}%`
					}
				}, 
			]
			}	
		});
		res.status(200).json({results});

	} else {
		return res.status(404).json({ msg: "Invalid search type"})
	}
}

export default {
    search
}