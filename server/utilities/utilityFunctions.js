const validator = require ('validator');
const User = require ('./../DataBase/models/user');
const jwt = require('jsonwebtoken');
const {statusCodes, messages, secretKeys} = require ('./constants');

const fieldsValidate = (object) => {
    if (("name" in object) && !(object.name)) {
        return `Name ${messages.empty}`;
    }
    if ((object.email) && !validator.isEmail(object.email)) {
        return `Email ${messages.invalid}`;
    }
    if(("password" in object) && !(object.password)) {
        return `Password ${messages.empty}`;
    }
    return false;
}

const isEmpty = (obj) => {
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        } 
    }
    return true;
}

const decode = (token) => {
    let decoded = {};
    try {
        decoded = jwt.verify(token, secretKeys.tokenKey, process.env.JWT_SECRET);
    } catch (error) {
        return(error);
    }
    return decoded;
}


module.exports = {fieldsValidate, isEmpty, decode};