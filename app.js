require('dotenv').config;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const port = process.env.PORT;

app.use(cookieParser('c is for cookie that´s good enough for me'));

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public/'));



mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}, (err) => {
    if(!err) console.log('connected');
    else console.log('Error', err);
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/toyRoutes'));
app.use('/', require('./routes/orderRoutes'));


app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});