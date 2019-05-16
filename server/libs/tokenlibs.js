const Token = require('../DataBase/models/tokens');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');

const createToken = function (token, it) {
    return new Promise((resolve, reject) => {
        Token.create({
            token,
            createdAt : it,
            expire_at : it + timeScale.twoDays    
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
                data : error
            });
        })
    })
}

module.exports = {createToken};