const {ObjectID} = require('mongodb');
const User = require('../server/DataBase/models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
    _id : userOneID,
    name : 'Andrew',
    email : 'andrew@example.com',
    password : 'password123'
},{
    _id : userTwoID,
    name : 'Jen',
    email : 'jen@example.com',
    password : 'password345'
}]

const populateUsers = done => { //eslint-disable-line
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done()); //eslint-disable-line
};

module.exports = {users, populateUsers};