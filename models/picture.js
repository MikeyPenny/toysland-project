const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    name: String,
    path: String,
    originalName: String,
    extension: String
},
{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

const Picture = mongoose.model('pictures', pictureSchema);

module.exports = Picture;