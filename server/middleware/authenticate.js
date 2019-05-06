let User = require('./../DataBase/models/user');
const jwt = require('jsonwebtoken');
const {statusCodes, messages} = require ('../utilities/constants');
const {isEmpty} = require('./../utilities/utilityFunctions');

const findByToken = function(token,req) {
    let decoded;
    let access = 'authentication';

    try {
        decoded = jwt.verify(token, access, process.env.JWT_SECRET);
    } catch (error) {
        return Promise.reject(error);
    }
    if(!isEmpty(req.params)) {
        if(req.params.id === decoded._id) {
            console.log(decoded);//eslint-disable-line no-console
            return User.findById(req.params.id);
        }
        return Promise.reject({status : statusCodes.unauthorized, message : messages.unauthorized});
    }
    if(req.body.id === decoded._id) {
        return User.findById(req.body.id);
    }
}
let authenticate = (req, res, next) => {
    let token = req.header('x-authentication');
    findByToken(token,req).then((user) => {
        if(!user) {
            return Promise.reject({status : statusCodes.unauthorized, message : messages.unauthorized});
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(statusCodes.unauthorized).send({status : statusCodes.unauthorized, message : messages.unauthorized});
    });
};

module.exports = {authenticate};