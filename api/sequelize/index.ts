import { Sequelize, DataType } from 'sequelize-typescript';
import fs from 'fs';
import path from 'path';
import { Model } from 'sequelize/types';

require('dotenv').config({ path: '.env.local' })
const modelsFolder = `${__dirname}/models`

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
	require('./models/user.model'),
	// require('./models/<model>'),
];

// Define all models
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

let db: { sequelize: Sequelize, Sequelize: Sequelize, [name:string] : any } = {
	sequelize: sequelize,
	Sequelize: sequelize
};

fs
  .readdirSync(modelsFolder)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' || file.slice(-3) === '.ts');
  })
  .forEach(file => {
    const model = require(path.join(modelsFolder, file))(sequelize, DataType);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// We export the sequelize connection instance to be used around our app.
export default db;
