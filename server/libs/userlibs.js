const User = require ('../DataBase/models/user');
const validator = require ('validator');
const _ = require ('lodash');
const bcrypt = require ('bcryptjs');
const {statusCodes, messages} = require ('../utilities/constants');

exports.register = function(req,res) {
    let body = _.pick(req.body, ['name', 'email','password']);
    User.create({
        name: body.name,
        email: body.email,
        password: body.password
    }).then((user) => {
        res.status(statusCodes.created).send({message : `User ${messages.created}`, data : user});
    }).catch((error) => {
        res.status(statusCodes.bad_request).send(error);
    }); 
};

exports.login = function(req,res){
    let body = req.body;
    let email = body.email;
    let password = body.password;
    User.findOne({email}).then((user) => {
        if(!user) {
            const data = {
                message : `User ${messages.not_found}`,
                status : statusCodes.not_found
            };
            res.status(data.status).send(data.message);
        }
            bcrypt.compare(password, user.password , (err,ans) => {                
                if(ans) {
                    res.status(statusCodes.successful).send({message : `Login ${messages.successful}`, data : user});
                } else {
                    const data = {
                        message : `Password ${messages.not_match}`,
                        status : statusCodes.forbidden
                    };
                    res.status(data.status).send(data.message);
                }
            })
    })
};

exports.updateUser = function (req,res) {
    let body = req.body;

    const validationForExistence = (object) => {
        if (('name' in object) && ('email' in object)) {
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