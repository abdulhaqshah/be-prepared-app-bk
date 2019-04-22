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

const populateUsers = done => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {users, populateUsers};