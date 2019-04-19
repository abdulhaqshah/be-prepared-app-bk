const path = require('path');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 8080;


module.exports = {port, publicPath};