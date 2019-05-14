const express = require('express');
const app = express();

// const User = require('../models/user');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

module.exports = app;