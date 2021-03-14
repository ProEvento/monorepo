import db from '../sequelize';
// const { pickRandom, randomDate } = require('./helpers/random');

async function reset() {
	console.log('Will rewrite the database and add some dummy data.');

	await db.sequelize.sync({ force: true });

	await db.sequelize.models.user.bulkCreate([
		{ username: 'maxtheleiter' },
	]);

	console.log('Done!');
}

reset();
