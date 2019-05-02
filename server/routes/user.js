const express = require('express');
const router = express.Router();
const userLibs = require('../libs/userlibs');
const {statusCodes, messages} = require ('../utilities/constants');

router.post('/user/register', (req, res) => {
    if(!req.body.name) {
        res.status(statusCodes.forbidden).send(`Name ${messages.empty}`); 
    }
    if(!req.body.password) {
        res.status(statusCodes.forbidden).send(`Password ${messages.notProvided}`);
    }
    userLibs.register(req.body).then((user) => {
        res.status(statusCodes.created).send({message : `User ${messages.created}`, data : user});
    }).catch((error) => {
        if(error.code === 11000){
            res.status(statusCodes.badRequest).send(`Email ${messages.duplicate}`);
        }
        res.status(statusCodes.forbidden).send(`Email ${messages.invalid}`);  
    });
});

router.post('/user/login', (req,res) => {
    userLibs.login(req.body.email, req.body.password).then((user) => {
        res.status(statusCodes.successful).send({message : `Login ${messages.successful}`, data : user});
    }).catch((error) => {
        res.status(error.status).send(error.message);
    })
});

router.patch('/user/userUpdate', (req,res) => {
    userLibs.updateUser(req.body).then((user) => {
        res.status(statusCodes.successful).send({message : `User ${messages.updated}`, data : user});
    }).catch((error) => {
        res.status(error.status).send(error.message);
    })
});

module.exports = router;