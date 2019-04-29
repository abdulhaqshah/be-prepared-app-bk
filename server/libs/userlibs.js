const User = require ('../DataBase/models/user');
const validator = require ('validator');
const _ = require ('lodash');
const bcrypt = require ('bcryptjs');
const {statusCodes, messages} = require ('../utilities/constants');

exports.register = function (req,res) {
    let body = _.pick ( req.body, ['name', 'email','password']);
    let user = new User(body);

    user.save().then( () => {
        res.status(statusCodes.created).send({message : `User ${messages.created}`, data : user});
    }).catch ( (error) => {
        res.status(statusCodes.bad_request).send(error);
    }); 
};

exports.login = function (req,res) {
    let body = req.body;
    let data = {};

    const validateUser = function (email,password) {
        return User.findOne({email}).then((user) => {
            if (!user) {
                data = {
                    message : `User ${messages.not_found}`,
                    status : statusCodes.not_found
                };
                return Promise.reject(data);
            }
            return new Promise ( (resolve, reject) => {
                bcrypt.compare(password, user.password , (err,res) => {                
                    if (res) {
                        resolve(user);
                    } else {
                        data = {
                            message : `Password ${messages.not_match}`,
                            status : statusCodes.forbidden
                        };
                        reject (data);
                    }
                })
            })
        })
}
    validateUser(body.email, body.password).then( (user) => {
        res.status(statusCodes.successful).send({message : `Login ${messages.successful}`, data : user});
    }).catch((error) => {
        res.status(error.status).send(error.message);
    });
};

exports.updateUser = function (req,res) {
    let body = req.body;

    const validationForExistence = (object) => {
        if ("name" && "email" in object) {
            return 1;
        } else if (!('name' in object) && "email" in object) {
            return 2;
        } else if (!('email' in object) && "name" in object) {
            return 3;
        }
            return 4;
        
    }

    const emptyCheck = (object) => {
        if (object.length === 0) {
            return false;
        }
            return true;
        
    }

    const update = (object) => {
        User.findByIdAndUpdate(object.id, object, {new: true}, (err, doc) => {
            if (doc) {
                res.status(statusCodes.successful).send({message : `User ${messages.updated}`, data : doc})
            } else {
                res.status(statusCodes.not_found).send(`User ${messages.not_found}`);
            }
        })
    }

    const emailValidation = (object) => {
            if(validator.isEmail(object.email)){
                update(object);
            }else{
                res.status(statusCodes.forbidden).send(`Email ${messages.invalid}`);
            }
    }

    switch (validationForExistence(body)) {
        case 1:
            if (emptyCheck(body.name)) {
                emailValidation(body);
            } else {
                res.status(statusCodes.forbidden).send(`Name ${messages.empty}`);
            }
            break;
        case 2:
            emailValidation(body);
            break;
        case 3:
            if (emptyCheck(body.name)) {
                update(body);
            }
            break;
        case 4:
            update(body);
            break;
        default:
            break;
    }
};