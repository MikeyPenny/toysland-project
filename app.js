const express = require('express');
const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const port = 3000;

app.use(cookieParser('c is for cookie that´s good enough for me'));

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public/'));


app.use(session({
    secret: 'cookie starts with c',
    cookie: {maxAge: 60000},
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60
    })
}));

mongoose.connect('mongodb://localhost/toysland', {useNewUrlParse: true}, (err) => {
    if(!err) console.log('connected');
    else console.log('Error', err);
});

app.use('/', atachUserInfo, require('./routes/toyRoutes'));
app.use('/', atachUserInfo, require('./routes/userRoutes'));
app.use('/', require('./routes/orderRoutes'));

function atachUserInfo(req, res, next) {
    res.locals.currentUser = req.session.currentUser;
    next();
}

app.listen(port, () => {
    console.log(`Listening at port: ${port}`);
});