const express = require('express');
const router = express.Router();
const database = require('../database');

/* GET home page. */
router.get('/landingPage', function (req, res, next) {
  let stores = [{
    id: 1,
    name: "Anna",
    items: [{
      id: 1,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 83,
      year: 2012
    }]
  }, {
    id: 2,
    name: "Anna 2",
    items: [{
      id: 2,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 84,
      year: 2013
    }]
  }, {
    id: 3,
    name: "Anna 3 ",
    items: [{
      id: 3,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 85,
      year: 2015
    }]
  }, {
    id: 4,
    name: "Anna 4",
    items: [{
      id: 3,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 85,
      year: 2015
    }]
  }];

  res.render('landingPage_v2', { title: 'This is Angular', stores: stores });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'This is Angular' });
});

router.get('/marketPlace', function (req, res, next) {
  let stores = [{
    id: 1,
    name: "Anna",
    items: [{
      id: 1,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 83,
      year: 2012
    }]
  }, {
    id: 2,
    name: "Anna 2",
    items: [{
      id: 2,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 84,
      year: 2013
    }]
  }, {
    id: 3,
    name: "Anna 3 ",
    items: [{
      id: 3,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 85,
      year: 2015
    }]
  }, {
    id: 4,
    name: "Anna 4",
    items: [{
      id: 3,
      name: "Friends",
      description: "Anna is a web designer living in New York.",
      image: ["https://mdbootstrap.com/img/Photos/Avatars/img%20(26).jpg"],
      liked: 85,
      year: 2015
    }]
  }];

  res.render('marketPlace', { title: 'This is Angular', stores: stores });
});

router.get('/shoppingCart', function (req, res, next) {
  const { profileId } = req.query;
  database.Cart.findAll({
    where: {
        profileId: profileId,
        isActive: true
    },
    include: [{
        model: database.Sku,
        as: "skus"
    }]
  }).then(function(carts){
    const cart = carts[0];
    let total = 0;
    const normalizedItems = cart.skus.map(function(sku){
      total += sku.skuCart.quantity * sku.price;
      return {
        "id": sku.id,
        "size": "75ml",
        "image": sku.images[0],
        "price": sku.price,
        "product": {
          "id": 20,
          "name": sku.name,
          
          "currency": sku.currency,
          "descriptions": {
            "detail": sku.description
          },
          "averageRating": 0
        },
        "currency": "USD",
        "quantity": sku.skuCart.quantity,
      }
    })

    return res.render('shoppingCart', {
      shoppingCart: {
        "id": cart.id,
        "items": normalizedItems,
        "currencyCode": "USD",
        "price": {
          "tax": 0,
          "total": total,
          "itemPrice": total
        }, 
      }
    });
  })
});

router.get('/shoppingCarts/:cartId/thankyou', function (req, res, next) {
  const { cartId } = req.params;
  database.Cart.findAll({
    where: {
        id: cartId
    },
    include: [{
        model: database.Sku,
        as: "skus"
    }]
  }).then(function(carts){
    const cart = carts[0];
    let total = 0;
    const normalizedItems = cart.skus.map(function(sku){
      total += sku.skuCart.quantity * sku.price;
      return {
        "id": sku.id,
        "size": "75ml",
        "image": sku.images[0],
        "price": sku.price,
        "product": {
          "id": 20,
          "name": sku.name,
          
          "currency": sku.currency,
          "descriptions": {
            "detail": sku.description
          },
          "averageRating": 0
        },
        "currency": "USD",
        "quantity": sku.skuCart.quantity,
      }
    })

    return res.render('thankyou', {
      shoppingCart: {
        "id": cart.id,
        "items": normalizedItems,
        "currencyCode": "USD",
        "price": {
          "tax": 0,
          "total": total,
          "itemPrice": total
        }, 
        paymentData: cart.paymentInfo
      }
    });
  })
});

module.exports = router;
