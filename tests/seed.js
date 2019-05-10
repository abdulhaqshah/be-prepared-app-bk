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

const populateUsers = done => { //eslint-disable-line
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done()); //eslint-disable-line
};

const setUuid = (index) => {
    return new Promise((resolve,reject) => {
        User.findById(users[index]._id).then((user) => {
            if (user) {
                users[index].uuid = user.uuid;
                resolve();
            } else {
                reject('NO user found');
            }
        })
    })
}

const setPayload = index => {
    return {
        _id : users[index].uuid,
        it : Date.now()
    }
}

module.exports = {users, populateUsers, setUuid, setPayload};