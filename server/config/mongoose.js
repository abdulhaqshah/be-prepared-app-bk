const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connect('mongodb://localhost:27017/BePreparedApp');

module.exports = {mongoose};

