import { query, Request, Response } from "express"
import db from '../../sequelize'
const { models } = db.sequelize;

async function getAll(req: Request, res: Response) {
	const hashtags = await models.Hashtags.findAll({ include: models.Event });
	res.status(200).json(hashtags);
};

async function addHashtagsByEvent(req: Request, res: Response) {
    console.log("ZZZZZZZZ")
	const id = req.query.id
	const hashtags = req.query.hashtags
	const event = await models.Event.findOne({
		where: {
			id: id
		}
    })

	if (!event) {
		return res.status(400).json({msg: "Event not found"})
    }

    const hashes = (hashtags as string).split(",");
    console.log(hashes)
	hashes.forEach(async (ht : any) => {
        console.log(ht)
        if (ht[0] == '#'){
            //@ts-ignore
            const hashtag = await event.createHashtag({ title: ht})
            if(!hashtag){
                res.status(404).json({ msg: "Failed to add hashtag: " + {ht}});
            }
        }
	})
	res.status(200).json({ msg: "Added all hashtags"})
};

export default {
	getAll, addHashtagsByEvent
};
