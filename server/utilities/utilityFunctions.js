const validator = require ('validator');
const {messages} = require ('./constants');
const User = require ('./../DataBase/models/user')

const fieldsValidator = (object) => {
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


module.exports = {fieldsValidator, isEmpty};