const User = require ('../DataBase/models/user');
const validator = require ('validator');
const bcrypt = require ('bcryptjs');
const {statusCodes, messages} = require ('../utilities/constants');

const register = function(userData) {
    return User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password
    })
};

const login = function(email,password){
    let data = {};
    return new Promise((resolve, reject) => {
        User.findOne({email}).then((user) => {
            if(!user) {
                data = {
                    message : `User ${messages.notFound}`,
                    status : statusCodes.notFound
                };
                reject(data);
            }
            if(user.deleted) {
                data = {
                    message : `User ${messages.notExist}`,
                    status : statusCodes.notFound
                };
                reject(data);
            }
            bcrypt.compare(password, user.password , (err,result) => {                
                if(result) {
                    resolve(user);
                    } else {
                    data = {
                        message : `Password ${messages.notMatch}`,
                        status : statusCodes.forbidden
                    };
                    reject(data);
                }
            })
        })
    })
};

const fieldsValidator = (object) => {
    if (("name" in object) && !(object.name)) {
        return (`Name ${messages.empty}`);
    }
    if ((object.email) && !validator.isEmail(object.email)) {
        return (`Email ${messages.invalid}`);
    }
    return false;
}

const updateUser = function (body) {
    let error = fieldsValidator(body);
    let data = {};

    return new Promise((resolve,reject) => {
        if(error){
            data = {
                status : statusCodes.forbidden,
                message : error
            }
            reject(data);
        } else {
            User.findOneAndUpdate({_id : body.id, deleted : false}, body, {new: true}, (err, doc) => {
                if (doc) {
                    resolve(doc);
                    } else {
                    data = {
                        status : statusCodes.notFound,
                        message : `User ${messages.notFound}`
                    }
                    reject(data);
                    }
            })
        }
    })
};

module.exports = {register, login, updateUser}