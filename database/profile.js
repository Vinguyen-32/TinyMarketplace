module.exports = function (sequelize, DataTypes) {
	return sequelize.define('profile', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		firstName: {
			type: DataTypes.TEXT
        },
        lastName: {
			type: DataTypes.TEXT
        },
        username: {
			type: DataTypes.TEXT,
			allowNull: false,
        },
        password: {
			type: DataTypes.TEXT,
			allowNull: false,
        },
        avatar: {
			type: DataTypes.TEXT
        },
        bio: {
			type: DataTypes.TEXT
		},
		data: {
			type: DataTypes.JSON
        },
	});
};
