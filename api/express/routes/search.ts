
import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;
import { Model, Op, useInflection } from "sequelize"

async function search(req: Request, res: Response) {
    // type: "event" | "user" | "event_date" | "groups",
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
		var results: any[] = [];
		//@ts-ignore
		if(!terms.join().includes("#")){
			results = await models.Event.findAll({
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
		}
		else{
			const events = await models.Event.findAll({
				order: [
					['time', sort === "ascending" ? "ASC" : "DESC"]
				],
				include: [{ model: models.Hashtag, as: "Hashtags"}, { model: models.User, as: "host"}, { model: models.User, as: "attendees"}]
			});
			results = [];
			const seen = [0];
			events.forEach(async (event : any) => {
				//@ts-ignore
				(event.Hashtags).forEach(async (eventh : any) => {
					console.log("zz")
					console.log(eventh)
					for (var i = 0; i < terms.length; i++){
						//@ts-ignore
						if(eventh.title == terms[i] && !seen.includes(event.id)){
							results.push(event)
							//@ts-ignore
							seen.push(event.id)
						}
					}	
				})
			})
		}
		res.status(200).json({results});

	} else if (type === "event_date") {
		//@ts-ignore
		const startDate = new Date(start)
		startDate.setDate(startDate.getDate()-1)
		startDate.setHours(23)
		startDate.setMinutes(59)
		startDate.setSeconds(59)
		//@ts-ignore
		const endDate = new Date(end)
		endDate.setHours(23)
		endDate.setMinutes(59)
		endDate.setSeconds(59)
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