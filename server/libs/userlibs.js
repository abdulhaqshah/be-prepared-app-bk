const User = require ('../DataBase/models/user');
const bcrypt = require ('bcryptjs');
const {fieldsValidator} = require('./../utilities/utilityFunctions')
const {statusCodes, messages} = require ('../utilities/constants');

const register = function(userData) {
    return new Promise((resolve,reject) => {
        if(!userData.name) {
            reject({
                message: `Name ${messages.empty}`,
                status : statusCodes.forbidden
            })
        }
        if(!userData.password) {
            reject({
                message: `Password ${messages.notProvided}`,
                status : statusCodes.forbidden
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
            if(error.code === 11000){
                reject({
                    message: `Email ${messages.duplicate}`,
                    status : statusCodes.badRequest
                })
            }
            reject({
                message: `Email ${messages.invalid}`,
                status : statusCodes.forbidden
            })
        })
    })
};

const login = function(body){
    return new Promise((resolve, reject) => {
        User.findOne({email : body.email, deleted : false}).then((user) => {
            if(!user) {
                reject({
                    message : `User ${messages.notFound}`,
                    status : statusCodes.notFound
            });
            }
            bcrypt.compare(body.password, user.password , (err,result) => {                
                if(result) {
                    resolve({status : statusCodes.successful, message : `Login ${messages.successful}`, data : user});
                    } else {
                    reject({
                        message : `Password ${messages.notMatch}`,
                        status : statusCodes.forbidden
                    });
                }
            })
        }).catch((error) => {
            reject({
                message : messages.notMatch,
                error,
                status : statusCodes.badRequest
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