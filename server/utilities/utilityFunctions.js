const validator = require ('validator');
const User = require ('./../DataBase/models/user');
const jwt = require('jsonwebtoken');
const {statusCodes, messages, secretKeys} = require ('./constants');

const validateFields = (object) => {
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

const decodeToken = (token) => {
    let decoded = {};
    try {
        decoded = jwt.verify(token, secretKeys.tokenKey, process.env.JWT_SECRET);
    } catch (error) {
        return(error);
    }
    return decoded;
}

const checkQuestionType = (arr,type) => {
    let question = [];
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].questions.length; j++) {
            if(arr[i].questions[j].problemSolving === type){
                question.push({
                    courseName : arr[i].name,
                    question : arr[i].questions[j]
                });
            }
        }
    }
    return question;
}

const checkUserId = (arr,userId) => {
    let check = false;
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].usersIDs.length; j++) {
            if(arr[i].usersIDs[j] === userId) {
                check = true;
            }
        }
    }
    return check;
}


module.exports = {validateFields, isEmpty, decodeToken, checkQuestionType, checkUserId};