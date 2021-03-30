
import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;
import { Model, Op, useInflection } from "sequelize"

async function search(req: Request, res: Response) {
    // type: "event" | "user",
    const { type } = req.params
	// query: string comma seperated terms, sort: "ascending" | "descending"
	const { query, sort, start, end }  = req.query

	const terms = query ? query!.toString().split(",") : ""

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
		//console.log(results)
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

	} else if (type === "event_date") {
		//@ts-ignore
		const startDate = new Date(start)
		startDate.setHours(0)
		startDate.setMinutes(0)
		//@ts-ignore
		const endDate = new Date(end)
		endDate.setHours(23)
		endDate.setMinutes(59)
		const results = await models.Event.findAll({
			order: [
				['time', "ASC"]
			],
			include: [{ model: models.User, as: "host"}, { model: models.User, as: "attendees"}],
			where: { 
				time: {
					[Op.between] : [startDate.toString(), endDate.toString()]
				}
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