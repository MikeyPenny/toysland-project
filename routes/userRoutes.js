const express = require('express');
const app = express();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const saltRounds = 10;

app.use(session({
    secret: process.env.Cookie_Secret,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60
    })
}));

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    let newUser = {username, email, password} = req.body;

    newUser = new User({
        username,
        email,
        password
    });

    User.find({email})
    .then(user => {
        if (user.length > 0) {
            res.send('email already exists');
        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) throw new Error('Hashing error!');
                else {
                    newUser.password = hash;
                    User.create(newUser)
                    .then(user => {
                        res.redirect('/login');
                    });
                }
            });
        }
    })
    .catch(err => {
        res.status(500).send('Error occured! :(');
    });

});

app.get('/login', atachUserInfo, (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    User.find({email: req.body.email})
    .then((user) => {
        if (user.length > 0) {
            bcrypt.compare(req.body.password, user[0].password, function(err ,equal) {
                if (equal) {
                    delete user[0].password;
                    req.session.currentUser = user[0];
                    res.redirect('/');
                } else {
                    res.send('Invalid credentials');
                }
            });
        } else {
            res.send('Invalid credentials');
        }
    })
    .catch((err) => {
        res.status(500).send('An error has occured');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) res.redirect('/');
        else res.redirect('/login');
    });
});



function atachUserInfo(req, res, next) {
    res.locals.currentUser = req.session.currentUser;
    next();
}

module.exports = app;