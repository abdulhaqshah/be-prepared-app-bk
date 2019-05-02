let User = require('./../DataBase/models/user');
const jwt = require('jsonwebtoken');

let authenticate = (req, res, next) => {

    const findByToken = function(token) {
        let decoded;
    
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return Promise.reject(error);
        }
    
        return User.findOne({
            '_id' : decoded._id,
            'tokens.token' : token,
            'tokens.access' : 'authentication'
        })
    }
    let token = req.header('x-authentication');

    findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject('No user found');
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send(err);
    });
};

module.exports = {authenticate};