module.exports = function (sequelize, DataTypes) {
	return sequelize.define('cart', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		isActive: {
			type: DataTypes.BOOLEAN
		},
		isPaid: {
			type: DataTypes.BOOLEAN
        },
        paymentInfo: {
			type: DataTypes.JSON
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
			type: DataTypes.JSON,
			allowNull: false,
        }
	});
};
