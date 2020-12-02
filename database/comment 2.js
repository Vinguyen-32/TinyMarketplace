module.exports = function (sequelize, DataTypes) {
	return sequelize.define('comment', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		title: {
            type: DataTypes.TEXT
        },
        content: {
			type: DataTypes.TEXT
        },
        images: {
            type: DataTypes.JSONB
        }
	});
};
