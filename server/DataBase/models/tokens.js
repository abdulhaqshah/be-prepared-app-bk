const mongoose = require('mongoose');

let TokensSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    },
    createdAt : {type: Date, default: Date.now},
    expire_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Token', TokensSchema);