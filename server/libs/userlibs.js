const User = require ('../DataBase/models/user');
const Token = require('../DataBase/models/tokens');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const {fieldsValidate} = require('./../utilities/utilityFunctions')
const {statusCodes, messages, secretKeys} = require ('../utilities/constants');

const register = function(userData) {
    return new Promise((resolve,reject) => {
        let result = fieldsValidate(userData);
        if (result) {
            reject({
                status : statusCodes.forBidden,
                message : result
            });
        }
        User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password
        }).then((user) => {
            if (user) {
                resolve({
                    status : statusCodes.created,
                    message : `User ${messages.created}`, 
                    data : user
                })
            }
            reject({
                status : statusCodes.badRequest,
                message: `${messages.wrong}`   
            })
        }).catch((error) => {
            if(error.code === 11000) {
                reject({
                    status : statusCodes.badRequest,
                    message: `Email ${messages.duplicate}`   
                })
            }
            reject({error})
        })
    })
};

const logIn = function(body) {
    return new Promise((resolve, reject) => {
        User.findOne({email : body.email, deleted : false}).then((user) => {
            if (!user) {
                reject({
                    status : statusCodes.notFound,
                    message : `User ${messages.notFound}`
                });
            }
            bcrypt.compare(body.password, user.password , (err,result) => {            
                if (result) {
                    const uuid = user.uuid;
                    let payload = {
                        _id : uuid,
                        it : Date.now()
                    }
                    let token = jwt.sign(payload, secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
                    resolve({
                        status : statusCodes.successful,
                        message : `Login ${messages.successful}`,
                        data : {user,token}
                    });
                } else {
                    reject({
                        status : statusCodes.forBidden,
                        message : `Password ${messages.notMatch}`
                    });
                }
            })
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                message : `Something ${messages.notMatch}`,
                error
            });
        })
    })
};

const updateUser = function (body) {
    let result = fieldsValidate(body);

    return new Promise((resolve,reject) => {
        if (result) {
            reject({
                status : statusCodes.forBidden,
                message : result
            });
        } else {
            User.findOneAndUpdate({uuid : body.uuid, deleted : false}, body, {new: true}).then((user) => {
                if (user) {
                    resolve({
                        status : statusCodes.successful,
                        message : `User ${messages.updated}`, 
                        data : user
                    });
                }
                reject({
                    status : statusCodes.notFound,
                    message : `User ${messages.notFound}`
                });
            }).catch((error) => {
                if(error.code === 11000) {
                    reject({
                        status : statusCodes.forBidden,
                        message : `Email ${messages.duplicate}`
                    });
                }
                reject({
                    status : statusCodes.notFound,
                    message : `User ${messages.notFound}`
                });
            })
        }
    })
};

const logOut = function(request) {
    return new Promise((resolve,reject) => {
        let token = request.header('x-authentication');
        let decoded = {};
        try {
            decoded = jwt.verify(token, secretKeys.tokenKey, process.env.JWT_SECRET);
        } catch (error) {
            reject(error);
        }
        Token.create({
            token,
            createdAt : decoded.it      
        }).then((token) => {
            if (token) {
                resolve({
                    status : statusCodes.successful,
                    message : `User ${messages.logOut}`
                })
            }
            reject({
                status : statusCodes.badRequest,
                message: `${messages.wrong}`   
            })
        }).catch((error) => {
            reject({error});
        })
    })
}

module.exports = {register, logIn, updateUser, logOut}