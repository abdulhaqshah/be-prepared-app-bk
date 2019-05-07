const mongoose = require('mongoose');

let TokensSchema = new mongoose.Schema({
    token : String,
    createdAt: {type: Date, expires: 172800000, default: Date.now}
});


module.exports = mongoose.model('Token', TokensSchema);