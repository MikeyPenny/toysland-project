const express = require('express');
const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const port = 3000;

app.use(cookieParser('c is for cookie that´s good enough for me'));

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public/'));

mongoose.connect('mongodb://localhost/toysland', {useNewUrlParser: true}, (err) => {
    if(!err) console.log('connected');
    else console.log('Error', err);
});




app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/toyRoutes'));
app.use('/', require('./routes/orderRoutes'));


app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});