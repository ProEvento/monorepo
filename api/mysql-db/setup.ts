import db from '../sequelize';
// const { pickRandom, randomDate } = require('./helpers/random');

async function reset() {
	// console.log('Will rewrite the database.');

	await db.sequelize.sync();

	console.log('Done!');
}

reset();
