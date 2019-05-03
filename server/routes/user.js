const express = require('express');
const router = express.Router();
const userLibs = require('../libs/userlibs');

router.post('/user/register', (req, res) => {
    userLibs.register(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error.message);
    });
});

router.post('/user/login', (req,res) => {
    userLibs.login(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error.message);
    })
});

router.patch('/user/userUpdate', (req,res) => {
    userLibs.updateUser(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error.message);
    })
});

module.exports = router;