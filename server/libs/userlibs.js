const User = require('../DataBase/models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {statusCodes, messages} = require('../utilities/constants')

exports.register = function(req,res) {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then((user) => {
        res.status(statusCodes.created).send({message : `User ${messages.created}`, data : user});
    }).catch((error) => {
        res.status(statusCodes.bad_request).send(error);
    });
};

exports.login = function(req,res){
    let email = req.body.email;
    let password = req.body.password;
    let data = {};
    
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

    User.findOne({email}).then((user) => {
        if(!user) {
            data = {
                message : `User ${messages.not_found}`,
                status : statusCodes.not_found
            };
            res.status(data.status).send(data.message);
        }
        if(user.deleted) {
            data = {
                message : `User ${messages.not_exist}`,
                status : statusCodes.not_found
            };
            res.status(data.status).send(data.message);
        }
        bcrypt.compare(password, user.password , (err,result) => {                
            if(result) {
                generateToken(user._id).then((token) => {
                    res.header('x-authentication', token).status(statusCodes.successful).send({message : `Login ${messages.successful}`, data : user});
                }).catch((error) => {
                res.status(error.status).send(error.message);
                });
            } else {
                data = {
                    message : `Password ${messages.not_match}`,
                    status : statusCodes.forbidden
                };
                res.status(data.status).send(data.message);
            }
        })
    })
};
