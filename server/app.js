const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const fs = require('fs');
const usersRouter = require('./routes/user');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/BePreparedApp');
const {User} = require('./DataBase/models/user');
const {Course} = require('./DataBase/models/course');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 8080;


const app = express();
app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use('/user', usersRouter);

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})