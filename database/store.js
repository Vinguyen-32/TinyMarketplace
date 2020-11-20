module.exports = function (sequelize, DataTypes) {
	return sequelize.define('store', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
        },
        description: {
			type: DataTypes.TEXT
        },
        status: {
			type: DataTypes.TEXT,
			allowNull: false,
        },
        bannerImage: {
			type: DataTypes.TEXT
        },
        avatar: {
			type: DataTypes.TEXT
        },
        address: {
			type: DataTypes.TEXT
        },
        schedule: {
			type: DataTypes.JSON
        }
	});
};
