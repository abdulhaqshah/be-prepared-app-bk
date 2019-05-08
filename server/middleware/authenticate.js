let User = require('./../DataBase/models/user');
let Token = require('./../DataBase/models/tokens');
const jwt = require('jsonwebtoken');
const {statusCodes, messages, secretKeys} = require ('../utilities/constants');
const {isEmpty} = require('./../utilities/utilityFunctions');

const findByToken = function(token,req) {
    let decoded;

    try {
        decoded = jwt.verify(token, secretKeys.tokenKey, process.env.JWT_SECRET);
    } catch (error) {
        return Promise.reject(error);
    }
    
    if(!isEmpty(req.params)) {
        if(req.params.id === decoded._id) {
            return User.findById(req.params.id);
        }
        return Promise.reject({status : statusCodes.unauthorized, message : messages.unauthorized});
    }
    if(req.body.id === decoded._id) {
        return User.findById(req.body.id);
    }
    return Promise.reject({status : statusCodes.unauthorized, message : messages.unauthorized});
}
const authenticate = (req, res, next) => {
    let token = req.header('x-authentication');
    Token.findOne({token : 'khlkl'}).then((result) => {
        if(!result) {
            findByToken(token,req).then((user) => {
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
        res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});

    }).catch((error) => error);
};

module.exports = {authenticate};