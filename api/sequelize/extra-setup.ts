import { Sequelize } from "sequelize-typescript"

export function applyExtraSetup(sequelize: Sequelize) {
	const { user } = sequelize.models;

	// user.hasMany(event);
	// event.belongsTo(user);
}
