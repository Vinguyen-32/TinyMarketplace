module.exports = function (sequelize, DataTypes) {
	return sequelize.define('sku', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.TEXT
        },
        description: {
			type: DataTypes.TEXT
        },
        price: {
			type: DataTypes.FLOAT,
			allowNull: false,
        },
        currency: {
			type: DataTypes.TEXT,
			allowNull: false,
        },
        images: {
			type: DataTypes.JSON
        }
	});
};
