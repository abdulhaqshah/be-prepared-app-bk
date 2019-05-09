let User = require('./../DataBase/models/user');
let Token = require('./../DataBase/models/tokens');
const jwt = require('jsonwebtoken');
const {statusCodes, messages, secretKeys} = require ('../utilities/constants');
const {isEmpty} = require('./../utilities/utilityFunctions');

const findByToken = function(token,id,req) {
    let decoded = {};
    return new Promise((resolve,reject) => {
        try {
            decoded = jwt.verify(token, secretKeys.tokenKey, process.env.JWT_SECRET);
        } catch (error) {
            reject(error);
        }
        if (id === decoded._id) {
            resolve(User.findById(req.body.id));
        }
        reject({status : statusCodes.unauthorized, message : messages.unauthorized});
    })
    
}
const authenticate = (req, res, next) => {
    let token = req.header('x-authentication');
    let id = req.header('id');
    Token.findOne({token}).then((result) => {
        if (result) {
            res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
        } else {
            findByToken(token,id,req).then((user) => {
                if(!user) {
                    res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
                }
                req.user = user;
                req.token = token;
                next();
            }).catch((err) => {
                res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
            });
        }

    }).catch((error) => error);
};

module.exports = {authenticate};