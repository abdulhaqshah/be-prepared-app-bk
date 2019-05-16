let User = require('./../DataBase/models/user');
let Token = require('./../DataBase/models/tokens');
const jwt = require('jsonwebtoken');
const {statusCodes, messages, secretKeys} = require ('../utilities/constants');
const {isEmpty, decodeToken} = require('./../utilities/utilityFunctions');

const findByToken = function(token,id,req) {
    let decoded = {};
    return new Promise((resolve,reject) => {
        decoded = decodeToken(token);
        if (id === decoded._id) {
            resolve(User.findOne({uuid : id}));
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