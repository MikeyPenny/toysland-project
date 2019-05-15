const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toySchema = new Schema({
    prodname: {type: String},
    units: {type: Number},
    description: {type: String},
    price: mongoose.Decimal128,
    picture: {type: String},
    stars: {type: Number}
});

const Toy = mongoose.model('toys', toySchema);

module.exports = Toy;
