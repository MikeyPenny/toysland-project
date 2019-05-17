const express = require('express');
const app = express();
const Toy = require('../models/toy');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'cookie starts with c',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60
    })
}));

app.get('/', atachUserInfo, (req, res) => {
    Toy.find()
    .then(result => {
        res.render('toylist', {toys: result});
    })
    .catch(err => {
        res.send('Error');
    });
});

app.get('/toyDetails/:id', atachUserInfo, (req, res) => {
    
    
    Toy.findById(req.params.id)
    .then(result => {
        
        let starred = req.session.currentUser.starred
        result.toyIsStarred = starred.indexOf(result.id) === -1? false: true;
        
        res.render('toydetail', {toy: result});
    })
    .catch(err => {
        res.send(err);
    });
});

app.get('/newToy', atachUserInfo, authenticateSession, (req, res) => {
    res.render('newToy');
});

app.post('/newToy', atachUserInfo, authenticateSession, (req, res) => {
    
    const _id = req.session.currentUser._id;
    
    
    let newToy = {prodname, units, description, price, picture} = req.body;

    newToy = new Toy({
        prodname, 
        units, 
        description,
        price, 
        picture,
        owner: _id
    });

    newToy.save()
    .then(() => {
        res.redirect('/');
    })
    .catch((err) => {
        res.send(err)
    });

});

app.get('/myFavs', (req, res) => {
    res.render('favorites');

    // router.get("/addToFavourite", (req, res) => {
    //     console.log(req.query);
    //     const eventId = req.query.eventId;
    //     const userId = req.session.currentUser._id;
    //     debugger
    //     User.findOneAndUpdate({_id: userId }, {$push:{events: eventId}}).then(updatedUser => {
    //         debugger
    //         res.redirect("/details/" + eventId);
    //     }).catch(err => {
    //         debugger
    //         throw err;
    //     })
    //  });

});

app.get('/myToys', atachUserInfo, authenticateSession, (req, res) => {
    
    Toy.find({owner: req.session.currentUser._id})
    .then(result => {
        res.render('myToys', {toys: result})
    })
    .catch(err => {
        res.send(err);
    });

});

app.get('/updateToy/:id', atachUserInfo, authenticateSession, (req, res) => {

    Toy.findById(req.params.id)
    .then(result => {
        res.render('editToy', {toy: result});
    })
    .catch(err => {
        res.send(err);
    });

});

app.post('/updateToy', atachUserInfo, authenticateSession, (req, res) => {

    let updateValues = {prodname, units, description, price, picture, owner} = req.body;

    let objectId = mongoose.Types.ObjectId(req.body.id);

    Toy.updateOne({_id: objectId}, updateValues, (err) => {
        if (err) res.status(500).send('There´s an error')
        else res.redirect('/');
    });

});

app.get('/starAToy/:id', atachUserInfo, authenticateSession, (req, res) => { 
    var toyId = mongoose.Types.ObjectId(req.params.id)
    User.update({_id: req.session.currentUser._id}, {$push: {starred: toyId}})
    .then(() => {
        Toy.findByIdAndUpdate(req.params.id, {$inc: {stars: 1}})
        .then(() => {
            req.session.currentUser.starred.push(toyId)
            res.redirect(`/toyDetails/${req.params.id}`);
        })
    })
    .catch(err => {
        res.send(err);
    });

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