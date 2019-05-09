const mongoose = require('mongoose');

let TokensSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    },
    createdAt: {type: Date, expires: 172800, default: Date.now}
});

module.exports = mongoose.model('Token', TokensSchema);