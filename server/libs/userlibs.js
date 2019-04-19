const {User} = require('../DataBase/models/user');
const _ = require('lodash');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const formidable = require('formidable');

//register a new user to the app
exports.register = function(req,res) {
    let body = _.pick(req.body, ['name', 'email','password']);
    let user = new User(body);

    user.save().then(() => {
        res.status(200).send(user);
    }).catch ((error) => {
        res.status(400).send(error);
    }); 
};

//login functionality for the app. Checks whether user exist and if exist the information provided is correct
exports.login = function(req,res){
    let body = _.pick(req.body , ['email','password']);
    let email = body.email;
    let password = body.password;

    const validateUser = function(email,password){
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password , (err,res) => {                
                if(res)
                {
                    resolve(user);
                }
                else{
                    reject();
                }
            })
        })
    })
}
    validateUser(body.email, body.password).then((user) => {
        res.status(200).send(user);
    }).catch((error) => {   
        res.status(400).send(error);
    });
};
