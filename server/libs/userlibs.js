const User = require ('../DataBase/models/user');
const validator = require ('validator');
const bcrypt = require ('bcryptjs');
const {statusCodes, messages} = require ('../utilities/constants');

exports.register = function(req,res) {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
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
            return 'nameAndEmailBothExists';
        } else if (!('name' in object) && "email" in object) {
            return 'emailExistsButNotName';
        } else if (!('email' in object) && "name" in object) {
            return 'nameExistsButNotEmail';
        }
            return 'bothNameAndEmailDontExist';
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
        case 'nameAndEmailBothExists':
            if (body.name.length > 0) {
                emailValidation(body);
            } else {
                res.status(statusCodes.forbidden).send(`Name ${messages.empty}`);
            }
            break;
        case 'emailExistsButNotName':
            emailValidation(body);
            break;
        case 'nameExistsButNotEmail':
            if (body.name.length > 0) {
                update(body);
            } else {
                res.status(statusCodes.forbidden).send(`Name ${messages.empty}`);
            }
            break;
        case 'bothNameAndEmailDontExist':
            update(body);
            break;
        default:
            break;
    }
};