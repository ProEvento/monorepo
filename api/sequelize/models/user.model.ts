import { DataType, Sequelize } from 'sequelize-typescript';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export default (sequelize: Sequelize) => {
	sequelize.define('user', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataType.INTEGER
		},
		username: {
			allowNull: false,
			type: DataType.STRING,
			unique: true,
		},
    firstName: DataType.STRING,
    lastName: DataType.STRING,
    github: DataType.STRING,
    linkedin: DataType.STRING,
    bio: DataType.STRING(500),
    twitterHandle: DataType.STRING,
    // attending, followingUsers, followingTags, notifications, proper auth
	});
};
