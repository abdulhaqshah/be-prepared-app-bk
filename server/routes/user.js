const express = require('express');
const router = express.Router();
const userLibs = require('../libs/userlibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/user/register', (req, res) => {
    userLibs.register(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/user/login', (req,res) => {
    userLibs.login(req.body).then((user) => {
        res.header('x-authentication', user.token).status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error.message);
    })
});

router.patch('/user/userUpdate', authenticate, (req,res) => {
    userLibs.updateUser(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error.message);
    })
});

module.exports = router;