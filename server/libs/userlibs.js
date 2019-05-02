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
    let email = req.body.email;
    let password = req.body.password;
    let data = {};
    User.findOne({email}).then((user) => {
        if(!user) {
            data = {
                message : `User ${messages.not_found}`,
                status : statusCodes.not_found
            };
            res.status(data.status).send(data.message);
        }
        if(user.deleted) {
            data = {
                message : `User ${messages.not_exist}`,
                status : statusCodes.not_found
            };
            res.status(data.status).send(data.message);
        }
        bcrypt.compare(password, user.password , (err,result) => {                
            if(result) {
                res.status(statusCodes.successful).send({message : `Login ${messages.successful}`, data : user});
            } else {
                data = {
                    message : `Password ${messages.not_match}`,
                    status : statusCodes.forbidden
                };
                res.status(data.status).send(data.message);
            }
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

exports.updateUser = function (req,res) {
    let body = req.body;
    let error = fieldsValidator(body);

    if(error){
        res.status(statusCodes.forbidden).send(error);
    } else {
        User.findOneAndUpdate({_id : body.id, deleted : false}, body, {new: true}, (err, doc) => {
            if (doc) {
                res.status(statusCodes.successful).send({message : `User ${messages.updated}`, data : doc})
            } else {
                res.status(statusCodes.not_found).send(`User ${messages.not_found}`);
            }
        })
    }
};