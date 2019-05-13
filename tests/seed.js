/*eslint-disable*/
const {ObjectID} = require('mongodb');
const User = require('../server/DataBase/models/user');
const {secretKeys} = require ('./../server/utilities/constants');

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

const populateUsers = () => {
    return User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    })
};

const setPayload = uuid => {
    return {
        _id : uuid,
        it : Date.now()
    }
}


module.exports = {users, populateUsers, setPayload};