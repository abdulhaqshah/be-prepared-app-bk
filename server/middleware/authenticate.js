let User = require('./../DataBase/models/user');
let Token = require('./../DataBase/models/tokens');
const jwt = require('jsonwebtoken');
const {statusCodes, messages, secretKeys} = require ('../utilities/constants');
const {isEmpty, decodeToken} = require('./../utilities/utilityFunctions');
const {getUser} = require('./../libs/userlibs');

const findByToken = function(token,id,req) {
    return new Promise((resolve,reject) => {
        let decoded = decodeToken(token);
        if (id === decoded._id) {
            let query = {
                uuid : id
            }
            getUser(query).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        } else {
            reject({status : statusCodes.unauthorized, message : messages.unauthorized});
        }
    })
}
const authenticate = (req, res, next) => {
    let token = req.header('x-authentication');
    let id = req.header('uuid');
    Token.findOne({token}).then((result) => {
        if (result) {
            res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
        } else {
            findByToken(token,id,req).then((user) => {
                if(user) {
                    req.user = user;
                    req.token = token;
                    next();
                } else {
                    res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
                }
            }).catch((err) => {
                res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
            });
        }
    }).catch((error) => error);
};

module.exports = {authenticate};