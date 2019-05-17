const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String},
    email: {type: String},
    password: {type: String},
    starred: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'toys'
    }],
    shoppingCard: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'toys'
    }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;