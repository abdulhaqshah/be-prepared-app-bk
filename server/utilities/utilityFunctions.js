const validator = require ('validator');
const {messages} = require ('./constants');

const fieldsValidator = (object) => {
    if (("name" in object) && !(object.name)) {
        return `Name ${messages.empty}`;
    }
    if ((object.email) && !validator.isEmail(object.email)) {
        return `Email ${messages.invalid}`;
    }
    return false;
}

module.exports = {fieldsValidator};