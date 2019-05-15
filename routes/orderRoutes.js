const express = require('express');
const app = express();

app.get('/cart', (req,res) => {
    res.render('cart');
});

module.exports = app;