const User = require('../DataBase/models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {statusCodes, messages} = require('../utilities/constants')

//register a new user to the app
exports.register = function(req,res) {
    let body = _.pick(req.body, ['name', 'email','password']);
    let user = new User(body);

    user.save().then(() => {
        res.status(statusCodes.created).send({message : `User ${messages.created}`, data : user});
    }).catch ((error) => {
        res.status(statusCodes.bad_request).send(error);
    }); 
};

//login functionality for the app. Checks whether user exist and if exist the information provided is correct
exports.login = function(req,res){
    let body = _.pick(req.body , ['email','password']);

    const validateUser = function(email,password){
    return User.findOne({email}).then((user) => {
        if(!user){
            const data = {
                message : `User ${messages.not_found}`,
                status : statusCodes.not_found
            };
            return Promise.reject(data);
        }
        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password , (err,res) => {                
                if(res){
                    resolve(user);
                } else {
                    const data = {
                        message : `Password ${messages.not_match}`,
                        status : statusCodes.forbidden
                    };
                    reject(data);
                    }
                })
            })
        })
    }

    const generateToken = function (id) {
         return User.findOne({_id: id}).then((user) => {
            if (user) {
                let access = 'authentication';
                let token = jwt.sign({_id: user._id.toHexString()}, access, process.env.JWT_SECRET).toString();
                user.tokens = user.tokens.concat([{access,token}]);
                return user.save().then(() => token);
            }
        }).catch((e) => e);
    }

    validateUser(body.email, body.password).then((user) => {
        generateToken(user._id).then((token) => {
            res.header('x-authentication', token).status(statusCodes.successful).send({message : `Login ${messages.successful}`, data : user});
        }).catch((error) => {
        res.status(error.status).send(error.message);
        });
    })
};