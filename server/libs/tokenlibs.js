const Token = require('../DataBase/models/tokens');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');

const createToken = function (token, createdTime) {
    return new Promise((resolve, reject) => {
        Token.create({
            token,
            createdAt : createdTime,
            expire_at : createdTime + timeScale.twoDays    
        }).then((token) => {
            if (token) {
                resolve(token);
            }
            reject({
                status : statusCodes.badRequest,
                message: `${messages.wrong}`   
            })
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        })
    })
}

module.exports = {createToken};