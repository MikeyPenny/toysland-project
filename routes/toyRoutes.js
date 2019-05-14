const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.render('toylist');
});

app.get('/toyDetails', (req, res) => {
    res.render('toydetail');
});

app.get('/newToy', (req, res) => {
    res.render('newToy');
});

app.get('/myFavs', (req, res) => {
    res.render('favorites');
});


module.exports = app;