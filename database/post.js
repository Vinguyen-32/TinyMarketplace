module.exports = function (sequelize, DataTypes) {
	return sequelize.define('post', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        subtitle: {
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
