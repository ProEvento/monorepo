import { Sequelize } from 'sequelize-typescript';
import { applyExtraSetup } from './extra-setup';

require('dotenv').config({ path: '.env.local' })

if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
	throw new Error("Missing required DB env vars.")
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	logQueryParameters: true,
	benchmark: true
});
  

const modelDefiners = [
	require('./models/user.model').default,
	// require('./models/<model>'),
];

// Define all models
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// Execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
export default sequelize;
