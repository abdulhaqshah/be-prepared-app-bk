require('./config/config');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/user');
const {port, publicPath} = require('./config/port');
const {mongoose} = require('./config/mongoose');

const app = express();
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use('/user', usersRouter);

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})