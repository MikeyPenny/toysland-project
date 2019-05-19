const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Toy = require('../models/toy');
const User = require('../models/user');

app.get('/addToCart/:id', atachUserInfo, authenticateSession, (req,res) => {
    
    var toyId = mongoose.Types.ObjectId(req.params.id)
    User.updateOne({_id: req.session.currentUser._id}, {$push: {shoppingCart: toyId}})
    .then(() => {
        Toy.findByIdAndUpdate(req.params.id, {$inc: {units: -1}})
        .then(() => {
            req.session.currentUser.shoppingCart.push(toyId);
            res.redirect(`/toyDetails/${req.params.id}`);
        })
    })
    .catch(err => {
        res.status(500).json({message: "not starred"});
    });
});

app.get('/removeToy/:id', atachUserInfo, authenticateSession, (req,res) => {
    
    var toyId = mongoose.Types.ObjectId(req.params.id)
    let indexId = req.session.currentUser.shoppingCart.indexOf(req.params.id);
    
    User.updateOne({_id: req.session.currentUser._id}, {$pull: {shoppingCart: {$in: [toyId]}}})
    .then(() => {
        Toy.findByIdAndUpdate(req.params.id, {$inc: {units: 1}})
        .then(() => {
            req.session.currentUser.shoppingCart.splice(indexId, 1);
            res.redirect(`/toyDetails/${req.params.id}`);
        })
    })
    .catch(err => {
        res.send(err);
    });

});

app.get('/cart', atachUserInfo, authenticateSession, (req, res) => {

    let cart = req.session.currentUser.shoppingCart;
    
    Toy.find({_id: req.session.currentUser.shoppingCart})
    .then(toys => {
        let total = 0;
        toys.forEach((toy) => {
            total += parseFloat(toy.price);
        });
        res.render('cart', {toys: toys, total: total});
    })
    .catch(err => {
        res.send(err);
    })

});

function authenticateSession(req, res, next) {
    if (req.session.currentUser) next();
    else res.send('You need to login');
}

function atachUserInfo(req, res, next) {
    res.locals.currentUser = req.session.currentUser;
    next();
}

module.exports = app;