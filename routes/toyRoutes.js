const express = require('express');
const app = express();
const Toy = require('../models/toy');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.get('/', (req, res) => {
    Toy.find()
    .then(result => {
        res.render('toylist', {toys: result});
    })
    .catch(err => {
        res.send('Error');
    });
});

app.get('/toyDetails/:id', (req, res) => {
    
    Toy.findById(req.params.id)
    .then(result => {
        res.render('toydetail', {toy: result});
    })
    .catch(err => {
        res.send(err);
    });
});

app.get('/newToy', (req, res) => {
    res.render('newToy');
});

app.post('/newToy', (req, res) => {
    
    let newToy = {prodname, units, description, picture} = req.body;

    newToy = new Toy({
        prodname, 
        units, 
        description, 
        picture
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
});


module.exports = app;