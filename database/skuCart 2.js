module.exports = function (sequelize, DataTypes) {
    return sequelize.define('skuCart', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unitPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "USD"
        },
        variants: {
            type: DataTypes.JSONB
        }
    });
};

