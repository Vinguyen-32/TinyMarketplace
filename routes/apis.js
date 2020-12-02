const database = require('../database');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const reqst = require("request");
const path = require('path');

const stripeFactory = require('stripe');//('sk_test_iVPnpKXLR9EvYdC74iQZNlAO');
const { ok } = require('assert');
const { response } = require('express');
const SECRET_KEY = "sk_test_LXdcKl7hCbf0dwoYaXOY5LMj"; 
const GOOGLE_MAP_TOKEN = "AIzaSyAHrP1nfdJkOmB32au7S3oXkQiOrCHn2hY";

function initStripe(auth){
    return stripeFactory(auth)
}

function charge_(stripe, params, cb){
    var params = {
        amount: params.amount,
        currency: params.currency,
        source: params.token.id,
    }

    stripe.charges.create(params, cb)
}



router.post('/signup', jsonParser, function (req, res) {
    const { username, password, email } = req.body;

    if (!username || !email || !password){
        return res.status(400).send({
            error: "MISSING_REQUIRED_PARAMS"
        });
    }

    database.Profile.create({
        username,
        email,
        password
    }).then(function(profile){
        return res.send(profile);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/login', jsonParser, function (req, res) {
    const { username, password } = req.body;

    if (!username || !password){
        return res.status(400).send({
            message: "Please fill your username and password"
        });
    }

    database.Profile.findAll({
        where: {
            username,
            password
        }
    }).then(function(profiles){
        if (profiles.length > 0){
            return res.send(profiles[0]);
        }
        else {
            return res.status(400).send({
                message: "Invalid username or password"
            })
        }
    }, function(err){
        return res.status(500).send(err);
    })
});

router.get('/stores/available', jsonParser, function (req, res) {
    database.Store.findAll({
        where: {
            status: "OPEN"
        }
    }).then(function(stores){
       return res.send(stores);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/users/:profileId/posts', function (req, res) {
    const { text } = req.body;
    const { profileId } = req.params

    let form = new formidable.IncomingForm(),
    files = [],
    fields = {};
    form.on('field', function(field, value) {
        fields[field] = value;
    })
    form.on('file', function(field, file) {
        const oldPath = file.path; 
        const newPath = path.join(__dirname, '../public/uploads') + '/' + file.name;
        const rawData = fs.readFileSync(oldPath) 
        fs.writeFile(newPath, rawData, function(err){});
        files.push(`uploads/${file.name}`);
    })
    form.on('end', function() {
        console.log('done');
        database.Post.create({
            title: "default title",
            content: fields.text,
            profileId,
            images: files
        }).then(function(post){
            return res.send(post);
        }, function(err){
            return res.status(500).send(err);
        })
    });
    form.parse(req);
});

router.get('/users/:profileId/feeds', function (req, res) {
    database.Post.findAll({
       include: [{
           model: database.Profile
       },{
           model: database.Comment,
           include:[{
               model: database.Profile
           }]
       }, {
           model: database.Profile,
           as: "liked"
       }],
       order: [
           ["createdAt", "desc"]
       ]
    }).then(function(posts){
       return res.send(posts);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.put('/users/:profileId/profile', function (req, res) {
    const { name, status } = req.body;
    const { profileId } = req.params;

    database.Profile.findAll({
        where: {
            id: profileId
        }
    }).then(function(profiles){
        let profile = profiles[0];
        if (!profile){
            res.status(400).send({
                error: "BAD_REQUEST"
            })
        }

        let payload = {
            data: JSON.parse(JSON.stringify(profile.data || {}))
        };

        if (status && status.trim() != ""){
            payload.data.status = status;
        }

        if (name && name.trim() != ""){
            let parts = name.split(" ");
            payload.firstName = parts[0];
            payload.lastName = parts[1] || "";
        }

        profile.update(payload).then(function(profile){
            return res.send(profile);
        })
    })
});

router.get('/users/:profileId/posts', function (req, res) {
    database.Post.findAll({
       include: [{
           model: database.Profile,
           where: {
               id: req.params.profileId
           }
       },{
           model: database.Comment,
           include:[{
               model: database.Profile
           }]
       }, {
           model: database.Profile,
           as: "liked"
       }],
       order: [
           ["createdAt", "desc"]
       ]
    }).then(function(posts){
       return res.send(posts);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.get('/users/:profileId/recommendations', function (req, res) {
    database.Sku.findAll({
        limit:2,
       include: [{
           model: database.Store,
           include:[{
               model: database.Profile
           }]
       }]
    }).then(function(skus){
       return res.send(skus);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/users/:profileId/posts/:postId/comments', jsonParser, function (req, res) {
    const { text } = req.body;
    const { profileId, postId } = req.params
    if (!text && text == ""){
        return res.status(400).send({
            message: "Bad input"
        })
    }
    database.Comment.create({
        title: "default title",
        content: text,
        profileId,
        postId
    }).then(function(post){
       return res.send(post);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.get('/users/:profileId/shoppingCarts/active', function (req, res) {
    const { profileId } = req.params;

    database.Cart.findOrCreate({
        where: {
            profileId,
            isActive: true
        }
    }).then(function(cart){
       return res.send(cart);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/users/:profileId/shoppingCarts/active/addItem', jsonParser, function (req, res) {
    const { profileId } = req.params;
    const { itemId } = req.body;

    database.Cart.findOrCreate({
        where: {
            profileId,
            isActive: true,
            storeId: 1
        },
        defaults: {
            price: 0,
            currency: "USD",
            images: [],
            isPaid: false
        }
    }).then(function(createdCart){
        let cart = createdCart[0];
        database.Sku.findAll({
            where: {
                id: itemId
            }
        }).then(function(skus){
            const sku = skus[0];
            database.SkuCart.findAll({
                where: {
                    cartId: cart.id,
                    skuId: sku.id
                }
            }).then(function(skuCarts){
                let skuCart = skuCarts[0];
                new Promise(function(ok, ko){
                    if (skuCart){
                        skuCart.update({
                            quantity: skuCart.quantity + 1
                        }).then(function(skuCart){
                            return ok()
                        })
                    }
                    else {
                        database.SkuCart.create({
                            cartId: cart.id,
                            skuId: sku.id,
                            currency: "USD",
                            unitPrice: sku.price,
                            quantity: 1
                        }).then(function(skuCart){
                            return ok()
                        })
                    }
                }).then(function(){
                    database.Cart.findAll({
                        where: {
                            id: cart.id
                        },
                        include: [{
                            model: database.Sku,
                            as: "skus"
                        }]
                    }).then(function(carts){
                        return res.send(carts[0]);
                    })
                })
            })
        })
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/users/:profileId/shoppingCarts/active/processPayment', jsonParser, function (req, res) {
    console.log("request: " + JSON.stringify(req.body))
    var input = req.body;

    database.Cart.findAll({
        where: {
            id: input.shoppingCartId
        }
    }).then(function(shoppingCarts){
        if (shoppingCarts.length == 0){
            return response.status(400).send({
                error: "INVALID_SHOPPING_CART_ID"
            })
        }

        var shoppingCart = shoppingCarts[0];
        var paymentInfo = {
            token: input.token,
            args: input.args
        }

        var paymentData = shoppingCarts.paymentInfo ? JSON.parse(JSON.stringify(shoppingCarts.paymentInfo)): []

        charge_(initStripe(SECRET_KEY), input, function(err, charge){
            if (err){
                paymentInfo.result = {
                    status: "failed",
                    error: err
                }
            }
            else {
                paymentInfo.result = charge;
            }
            
            var status = charge && charge.status ? charge.status : "failed"

            paymentData.unshift(paymentInfo)
            shoppingCart.update({
                paymentInfo: paymentData,
                isActive: status != "succeeded",
                isPaid: status == "succeeded"
            }).then(function(shoppingCart){
                return res.send(shoppingCart)
            })
        })
    })
})

router.post('/users/:profileId/posts/:postId/like', jsonParser, function (req, res) {
    const { profileId, postId } = req.params

    database.Like.findAll({
        where: {
            profileId,
            postId
        }  
    }).then(function(posts){
        const post = posts[0]
        new Promise(function(ok, ko){
            if (post){
                post.destroy().then(function(){
                    return ok()
                })
            }
            else {
                database.Like.create({
                    profileId,
                    postId
                }).then(function(){
                    return ok();
                })
            }
        }).then(function(){
            database.Post.findAll({
                where: {
                    id: postId
                },
                include: [{
                    model: database.Profile,
                    as: "liked"
                }]
            }).then(function(posts){
                const post = posts[0];
                return res.send(post);
            })
        })   
    }, function(err){
        return res.status(500).send(err);
    })
});

router.get('/users/:profileId/friends', function (req, res) {
    const { search } = req.query;
    const { profileId } = req.params;

    let whereClause = {
        where: {
            id: profileId,
        },
        include: [{
            model: database.Profile,
            as: "friends"
        }]
    }

    if (search && search != ""){
        whereClause.include[0].where = {
            $or: [
                { firstName: { $iLike: "%" + search + "%" } },
                { lastName: { $iLike: "%" + search + "%" } }
            ]
        }
    }

    database.Profile.findAll(whereClause).then(function(profiles){
       return res.send(_.get(profiles[0], "friends") || []);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.get('/users/:profileId', function (req, res) {
    const { profileId } = req.params;

    database.Profile.findAll({
        where: {
            id: profileId
        }
    }).then(function(profiles){
       return res.send(profiles[0]);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/users/:profileId/avatar', function (req, res) {
    const { profileId } = req.params

    let form = new formidable.IncomingForm(),
    files = [],
    fields = {};
    form.on('field', function(field, value) {
        fields[field] = value;
    })
    form.on('file', function(field, file) {
        const oldPath = file.path; 
        const newPath = path.join(__dirname, '../public/uploads') + '/' + file.name;
        const rawData = fs.readFileSync(oldPath) 
        fs.writeFile(newPath, rawData, function(err){});
        files.push(`uploads/${file.name}`);
    })
    form.on('end', function() {
        console.log('done');
        database.Profile.findAll({
            where: {
                id: profileId
            }
        }).then(function(profiles){
            let profile = profiles[0];

            if (!profile){
                return res.status(404).send({
                    error: "NOT_FOUND"
                })
            }

            profile.update({
                avatar: files[0] || "/uploads/user_default_img.png"
            }).then(function(profile){
                return res.send(profile);
            }, function(err){
                return res.status(500).send(err);
            })
        }, function(err){
            return res.status(500).send(err);
        })
    });
    form.parse(req);
});

router.post('/users/:profileId/banner', function (req, res) {
    const { profileId } = req.params

    let form = new formidable.IncomingForm(),
    files = [],
    fields = {};
    form.on('field', function(field, value) {
        fields[field] = value;
    })
    form.on('file', function(field, file) {
        const oldPath = file.path; 
        const newPath = path.join(__dirname, '../public/uploads') + '/' + file.name;
        const rawData = fs.readFileSync(oldPath) 
        fs.writeFile(newPath, rawData, function(err){});
        files.push(`uploads/${file.name}`);
    })
    form.on('end', function() {
        console.log('done');
        database.Profile.findAll({
            where: {
                id: profileId
            }
        }).then(function(profiles){
            let profile = profiles[0];

            if (!profile){
                return res.status(404).send({
                    error: "NOT_FOUND"
                })
            }

            let pData = JSON.parse(JSON.stringify(profile.data || {}));
            pData.banner_image = files[0] || "/images/cover-img.jpg"

            profile.update({
                data: pData
            }).then(function(profile){
                return res.send(profile);
            }, function(err){
                return res.status(500).send(err);
            })
        }, function(err){
            return res.status(500).send(err);
        })
    });
    form.parse(req);
});

router.post('/users/:profileId/shoppingCarts/active/removeItem', jsonParser, function (req, res) {
    const { profileId } = req.params;
    const { itemId } = req.body;

    database.Cart.findOrCreate({
        where: {
            profileId,
            isActive: true,
            storeId: 1
        },
        defaults: {
            price: 0,
            currency: "USD",
            images: [],
            isPaid: false
        }
    }).then(function(createdCart){
        let cart = createdCart[0];
        database.Sku.findAll({
            where: {
                id: itemId
            }
        }).then(function(skus){
            const sku = skus[0];
            database.SkuCart.findAll({
                where: {
                    cartId: cart.id,
                    skuId: sku.id
                }
            }).then(function(skuCarts){
                let skuCart = skuCarts[0];
                new Promise(function(ok, ko){
                    if (skuCart){
                        if ((skuCart.quantity - 1) == 0){
                            skuCart.destroy();
                        }
                        else {
                            skuCart.update({
                                quantity: skuCart.quantity - 1
                            }).then(function(skuCart){
                                return ok()
                            })
                        }
                    }
                    else return ok();
                }).then(function(){
                    database.Cart.findAll({
                        where: {
                            id: cart.id
                        },
                        include: [{
                            model: database.Sku,
                            as: "skus"
                        }]
                    }).then(function(carts){
                        return res.send(carts[0]);
                    })
                })
            })
        })
    }, function(err){
        return res.status(500).send(err);
    })
});

router.delete('/users/:profileId/shoppingCarts/active/items', jsonParser, function (req, res) {
    const { profileId } = req.params;
    const { itemId } = req.body;

    database.Cart.findOrCreate({
        where: {
            profileId,
            isActive: true,
            storeId: 1
        },
        defaults: {
            price: 0,
            currency: "USD",
            images: [],
            isPaid: false
        }
    }).then(function(createdCart){
        let cart = createdCart[0];
        database.Sku.findAll({
            where: {
                id: itemId
            }
        }).then(function(skus){
            const sku = skus[0];
            database.SkuCart.destroy({
                where: {
                    cartId: cart.id,
                    skuId: sku.id
                }
            }).then(function(){
                database.Cart.findAll({
                    where: {
                        id: cart.id
                    },
                    include: [{
                        model: database.Sku,
                        as: "skus"
                    }]
                }).then(function(carts){
                    return res.send(carts[0]);
                })
            })
        })
    }, function(err){
        return res.status(500).send(err);
    })
});

router.get('/users/:profileId/store', function (req, res) {
    const { profileId } = req.params;

    database.Store.findAll({
        include: [{
            model: database.Profile,
            where: {
                id: profileId
            }
        }]
    }).then(function(stores){
        let store = stores[0];
        if (!store){
            database.Store.create({
                name: "Default Shop Name",
                descripttion: "Your dream shop",
                status: "CLOSE",
                avatar: "https://cdn4.iconfinder.com/data/icons/shopping-113/24/store_local_shop_building-512.png",
                profileId
            }).then(function(store){
                return res.send(store);
            })
        }
        else {
            return res.send(store);
        }
    })
})

router.get('/stores/:storeId', function (req, res) {
    const { storeId } = req.params;

    database.Store.findAll({
        where: {
            id: storeId,
            status: "OPEN"
        }
    }).then(function(stores){
        let store = stores[0];
        if (!store){
            return res.status(404).send({
                error: "NOT_FOUND"
            })
        }
        else {
            return res.send(store);
        }
    })
})

router.put('/users/:profileId/store/status', function (req, res) {
    const { profileId } = req.params;

    database.Store.findAll({
        include: [{
            model: database.Profile,
            where: {
                id: profileId
            }
        }]
    }).then(function(stores){
        let store = stores[0];

        store.update({
            status: store.status == "CLOSE" ? "OPEN" : "CLOSE"
        }).then(function(store){
            return res.send(store)
        })
    })
})

router.get('/stores/:storeId/skus', function (req, res) {
    const { storeId } = req.params;
    database.Sku.findAll({
       include: [{
           model: database.Store,
           where: {
               id: storeId
           }
       }]
    }).then(function(skus){
       return res.send(skus);
    }, function(err){
        return res.status(500).send(err);
    })
});

router.post('/stores/:storeId/skus', function (req, res) {
    const { storeId } = req.params;

    let form = new formidable.IncomingForm(),
    files = [],
    fields = {};
    form.on('field', function(field, value) {
        fields[field] = value;
    })
    form.on('file', function(field, file) {
        const oldPath = file.path; 
        const newPath = path.join(__dirname, `../public/uploads/stores`) + '/' + file.name;
        const rawData = fs.readFileSync(oldPath) 
        fs.writeFile(newPath, rawData, function(err){});
        files.push(`uploads/stores/${file.name}`);
    })
    form.on('end', function() {
        console.log('done');
        database.Sku.create({
            name: fields.name,
            description: fields.description,
            price: fields.price,
            currency: "USD",
            images: files,
            storeId: storeId
        }).then(function(sku){
            return res.send(sku);
        }, function(err){
            return res.status(500).send(err);
        })
    });
    form.parse(req);
});

router.put('/stores/:storeId/skus/:skuId', function (req, res) {
    const { storeId, skuId } = req.params;

    let form = new formidable.IncomingForm(),
    files = [],
    fields = {};
    form.on('field', function(field, value) {
        fields[field] = value;
    })
    form.on('file', function(field, file) {
        const oldPath = file.path; 
        const newPath = path.join(__dirname, `../public/uploads/stores`) + '/' + file.name;
        const rawData = fs.readFileSync(oldPath) 
        fs.writeFile(newPath, rawData, function(err){});
        files.push(`uploads/stores/${file.name}`);
    })
    form.on('end', function() {
        console.log('done');

        database.Sku.findAll({
            where: {
                id: skuId
            }
        }).then(function(skus){
            let sku = skus[0];
            if (!sku){
                return res.status(404).send({
                    error: "NOT_FOUND"
                })
            }


            sku.update({
                name: fields.name,
                description: fields.description,
                price: fields.price,
                images: files,
            }).then(function(sku){
                return res.send(sku);
            }, function(err){
                return res.status(500).send(err);
            })
        })
    });
    form.parse(req);
});

router.delete('/stores/:storeId/skus/:skuId', function (req, res) {
    const { skuId } = req.params;

    database.Sku.destroy({
        where: {
            id: skuId
        }
    }).then(function(){
        return res.send({
            status: "ok"
        })
    })
})

router.put('/stores/:storeId', function (req, res) {
    const { storeId } = req.params;

    let form = new formidable.IncomingForm(),
    files = [],
    fields = {};
    form.on('field', function(field, value) {
        fields[field] = value;
    })
    form.on('file', function(field, file) {
        const oldPath = file.path; 
        const newPath = path.join(__dirname, `../public/uploads/stores`) + '/' + file.name;
        const rawData = fs.readFileSync(oldPath) 
        fs.writeFile(newPath, rawData, function(err){});
        files.push(`uploads/stores/${file.name}`);
    })
    form.on('end', function() {
        console.log('done');

        database.Store.findAll({
            where: {
                id: storeId
            }
        }).then(function(stores){
            let store = stores[0];
            if (!store){
                return res.status(404).send({
                    error: "NOT_FOUND"
                })
            }

            let log = null, lat = null;

            new Promise(function(ok, ko){
                if (fields.address && fields.address.trim() != ""){
                    geoCode(fields.address, function(err, data){
                        lat = _.get(data, "geometry.location.lat") || null;
                        log = _.get(data, "geometry.location.lng") || null;
                        return ok();
                    })
                }
                else {
                    return ok();
                }
            }).then(function(){
                store.update({
                    name: fields.name,
                    description: fields.description,
                    avatar: files[0],
                    address: fields.address,
                    longitude: log,
                    latitude: lat
                }).then(function(sku){
                    return res.send(sku);
                }, function(err){
                    return res.status(500).send(err);
                })
            })
        })
    });
    form.parse(req);
});

function geoCode(address, cb){
    let qs = {
        key: GOOGLE_MAP_TOKEN,
        language: "en",
        address: address,
    };
     
    reqst({
        uri: 'https://maps.googleapis.com/maps/api/geocode/json',
        method: 'GET',
        qs: qs,
    },
    function(err, res, body) {
        let result = JSON.parse(body).results[0];
        console.log(body)
        console.log(JSON.stringify(result, null, 4))
        return cb(null, result)
    })
}

module.exports = router;
