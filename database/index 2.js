const Sequelize = require('sequelize')

let db = {};
let db_url = process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/cmpe130";


if (!db_url) {
    console.log("No connection string found");
}
else {
    console.log(`Connecting to database with connection string "${db_url}"`);
    
    const sqlregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const match = db_url.match(sqlregex);

    if (match && match.length == 6) {
        let user = match[1];
        let password = match[2];
        let host = match[3];
        let port = match[4];
        let dbname = match[5];

        const Op = Sequelize.Op;
        const operatorsAliases = {
            $eq: Op.eq,
            $ne: Op.ne,
            $gte: Op.gte,
            $gt: Op.gt,
            $lte: Op.lte,
            $lt: Op.lt,
            $not: Op.not,
            $in: Op.in,
            $notIn: Op.notIn,
            $is: Op.is,
            $like: Op.like,
            $notLike: Op.notLike,
            $iLike: Op.iLike,
            $notILike: Op.notILike,
            $regexp: Op.regexp,
            $notRegexp: Op.notRegexp,
            $iRegexp: Op.iRegexp,
            $notIRegexp: Op.notIRegexp,
            $between: Op.between,
            $notBetween: Op.notBetween,
            $overlap: Op.overlap,
            $contains: Op.contains,
            $contained: Op.contained,
            $adjacent: Op.adjacent,
            $strictLeft: Op.strictLeft,
            $strictRight: Op.strictRight,
            $noExtendRight: Op.noExtendRight,
            $noExtendLeft: Op.noExtendLeft,
            $and: Op.and,
            $or: Op.or,
            $any: Op.any,
            $all: Op.all,
            $values: Op.values,
            $col: Op.col
        };

        let config = {
            dialect: 'postgres',
            protocol: 'postgres',
            port: port,
            host: host,
            operatorsAliases: operatorsAliases,
            dialectOptions: {
                charset: 'utf8mb4'
            },
            define: {},
            logging: process.env.LOG_SEQUELIZE == "1",
            syncOnAssociation: true,
            pool: {
                max: 5,
                min: 0,
                acquire: 20000,
                idle: 20000
            },
            maxConcurrentQueries: 150,
            language: 'en'
        };


        // connect to database
        let sq = new Sequelize(dbname, user, password, config);

        db = {
            Sequelize: Sequelize,
            sequelize: sq,
            Cart: require(__dirname + '/cart')(sq, Sequelize.DataTypes),
            Comment: require(__dirname + '/comment')(sq, Sequelize.DataTypes),
            Post: require(__dirname + '/post')(sq, Sequelize.DataTypes),
            Profile: require(__dirname + '/profile')(sq, Sequelize.DataTypes),
            Store: require(__dirname + '/store')(sq, Sequelize.DataTypes),
            Sku: require(__dirname + '/sku')(sq, Sequelize.DataTypes),
            SkuCart: require(__dirname + '/skuCart')(sq, Sequelize.DataTypes),
            Like: require(__dirname + '/like')(sq, Sequelize.DataTypes),
            Friend: require(__dirname + '/friend')(sq, Sequelize.DataTypes),
            Follow: require(__dirname + '/follow')(sq, Sequelize.DataTypes),
        };

        
        db.Store.belongsTo(db.Profile);

        db.Profile.hasMany(db.Post);
        db.Post.belongsTo(db.Profile);

        db.Profile.hasMany(db.Comment);
        db.Comment.belongsTo(db.Profile);

        db.Post.hasMany(db.Comment);
        db.Comment.belongsTo(db.Post);

        // db.Post.hasMany(db.Profile, { as: "likedBy" });
        // db.Post.hasMany(db.Profile, { as: "viewedBy" });

        db.Profile.hasMany(db.Profile, { as: "follow" });
        db.Profile.hasMany(db.Profile, { as: "followedBy" });

        db.Store.hasMany(db.Sku);
        db.Sku.belongsTo(db.Store);

        db.Cart.belongsToMany(db.Sku, {as: "skus", through: db.SkuCart});
        db.Sku.belongsToMany(db.Cart, {as: "carts", through: db.SkuCart});
        
        db.Cart.belongsTo(db.Store);
        db.Store.hasMany(db.Cart);

        db.Cart.belongsTo(db.Profile);
        db.Profile.hasMany(db.Cart);

        db.Profile.belongsToMany(db.Post, { as: "likes", through: db.Like });
        db.Post.belongsToMany(db.Profile, { as: "liked", through: db.Like });

        db.Profile.belongsToMany(db.Profile, { as: "friends", through: db.Friend });
        // db.Profile.belongsToMany(db.Profile, { as: "follow", through: db.Follow });
    }
}

module.exports = db;


