require('./config/config');
require('./config/mongoose');
const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const {port, publicPath} = require('./config/port');
const app = express();

app.use(express.static(publicPath));
app.use(bodyParser.json());

routes.forEach(function(route) {
    let controller = require(route);
    app.use("/", controller);
});

app.listen(port , () => {
    //eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
})

module.exports = {app};