const User = require ('../DataBase/models/user');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const {fieldsValidate, decodeToken} = require('./../utilities/utilityFunctions');
const {createToken} = require('./tokenlibs');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');

const register = function (userData) {
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
            reject({
                status : statusCodes.badRequest,
                error
            });
        })
    })
};

const getUser = function (query) {
    return new Promise((resolve,reject) => {
        User.findOne(query).then((user) => {
            if (user) {
                resolve(user);
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `User ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        })
    })
}
const logIn = function (body) {
    return new Promise((resolve, reject) => {
        let query = {
            email : body.email,
            deActivate : false
        }
        getUser(query).then((user) => {
            bcrypt.compare(body.password, user.password , (err,result) => {            
                if (result) {
                    const uuid = user.uuid;
                    let payload = {
                        _id : uuid,
                        createdTime : Date.now()
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
            reject(error);
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
            body.updatedAt = Date.now();
            User.findOneAndUpdate({uuid : body.uuid, deActivate : false}, body, {new: true}).then((user) => {
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

const logOut = function (token) {
    return new Promise((resolve,reject) => {
        let decoded = decodeToken(token);
        createToken(token,decoded.createdTime).then((token) => {
            resolve({
                status : statusCodes.successful,
                message : `User ${messages.logOut}`
            })
        }).catch((error) => {
            reject(error);
        })
    })
}

const deActivateUser = function (body) {
    return new Promise((resolve,reject) => {
        let query = {
            uuid : body.uuid
        }
        getUser(query).then((user) => {
            if (user.isAdmin) {
                let query = {
                    deActivate : true,
                    deActivatedAt : Date.now(),
                    deActivatedBy : user.email
                }
                User.findOneAndUpdate({uuid : body.uuid, deActivate : false}, query, {new : true})
                .then((user) => {
                    if(user) {
                        resolve({
                            status : statusCodes.successful,
                            message : `User ${messages.deActivated}`
                        });
                    } else {
                        reject({
                            status : statusCodes.notFound,
                            message : `User ${messages.notFound}`
                        });
                    }
                }).catch((error) => {
                    reject({
                        status : statusCodes.badRequest,
                        error
                    });
                })
            } else {
                reject({
                    status : statusCodes.forBidden,
                    message : `User ${messages.notAdmin}`
                });
            }
        }).catch((error) => {
            reject(error);
        })
    })
}

const deleteUser = function (body) {
    let id = body.uuid;
    return new Promise((resolve,reject) => {
        User.findOneAndDelete({uuid : id, deActivate : false}).then((user) => {
            if (user) {
                let decoded = decodeToken(body.token);
                createToken(body.token, decoded.createdTime).then((token) => {
                    resolve({
                        status : statusCodes.successful,
                        message : `User ${messages.deleted}`
                    });
                })
                .catch((error) => {
                    reject(error);
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `User ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        })
    })
}

module.exports = {register, logIn, updateUser, logOut, deleteUser, deActivateUser}