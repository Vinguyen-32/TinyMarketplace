const express = require('express');
const router = express.Router();
const database = require('../database');

/* GET home page. */
router.get('/landingPage', function (req, res, next) {
  res.render('landingPage_v2', { title: 'This is Angular', profile: {} });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'This is Angular' });
});

router.get('/personal', function (req, res, next) {
  const { profileId } = req.query;
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
    return res.render('marketPlace', { title: 'This is Angular', profileId, profile});
  })
});

router.get('/store', function (req, res, next) {
  const { storeId } = req.query;
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
    return res.render('store', { title: 'This is Angular', store, storeId});
  })
});

router.get('/shoppingCart', function (req, res, next) {
  const { profileId } = req.query;

  database.Cart.findOrCreate({
    where: {
        profileId,
        isActive: true
    },
    defaults: {
      images: [],
      currency: "USD",
      price: 0
    }
  }).then(function(cart){
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
