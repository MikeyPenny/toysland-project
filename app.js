require('dotenv').config();
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

const MONGODB_URI="mongodb://Mikster:123456Mikey@toys-land-shard-00-00-bpank.mongodb.net:27017,toys-land-shard-00-01-bpank.mongodb.net:27017,toys-land-shard-00-02-bpank.mongodb.net:27017/test?ssl=true&replicaSet=toys-land-shard-0&authSource=admin&retryWrites=true"

mongoose.connect(MONGODB_URI, {useNewUrlParser: true}, (err) => {
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