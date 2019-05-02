const User = require ('../DataBase/models/user');
const bcrypt = require ('bcryptjs');
const {fieldsValidator} = require('./../utilities/utilityFunctions')
const {statusCodes, messages} = require ('../utilities/constants');

const register = function(userData) {
    return new Promise((resolve,reject) => {
        if(!userData.name) {
            reject({
                status : statusCodes.forbidden,
                message: `Name ${messages.empty}`
            })
        }
        if(!userData.password) {
            reject({
                status : statusCodes.forbidden,
                message: `Password ${messages.notProvided}`
            })
        }
        User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password
        }).then((user) => {
            resolve({
                status : statusCodes.created,
                message : `User ${messages.created}`, 
                data : user
            })
        }).catch((error) => {
            if(error.code === 11000) {
                reject({
                    status : statusCodes.badRequest,
                    message: `Email ${messages.duplicate}`   
                })
            }
            reject({
                status : statusCodes.forbidden,
                message: `Email ${messages.invalid}`
            })
        })
    })
};

const login = function(body){
    return new Promise((resolve, reject) => {
        User.findOne({email : body.email, deleted : false}).then((user) => {
            if(!user) {
                reject({
                    status : statusCodes.notFound,
                    message : `User ${messages.notFound}`
                });
            }
            bcrypt.compare(body.password, user.password , (err,result) => {                
                if(result) {
                    resolve({
                        status : statusCodes.successful,
                        message : `Login ${messages.successful}`,
                        data : user
                    });
                } else {
                    reject({
                        status : statusCodes.forbidden,
                        message : `Password ${messages.notMatch}`
                    });
                }
            })
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                message : messages.notMatch,
                error
            });
        })
    })
};

const updateUser = function (body) {
    let error = fieldsValidator(body);

    return new Promise((resolve,reject) => {
        if(error){
            reject({
                status : statusCodes.forbidden,
                message : error
            });
        } else {
            User.findOneAndUpdate({_id : body.id, deleted : false}, body, {new: true}, (err, doc) => {
                if (doc) {
                    resolve({
                        status : statusCodes.successful,
                        message : `User ${messages.updated}`, 
                        data : doc
                    });
                } else {
                    reject({
                        status : statusCodes.notFound,
                        message : `User ${messages.notFound}`
                    });
                }
            })
        }
    })
};

module.exports = {register, login, updateUser}
    const validateUser = function(email,password){
    return User.findOne({email}).then((user) => {
        if(!user){
            const data = {
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
