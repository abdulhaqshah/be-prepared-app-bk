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
    userLibs.logIn(req.body).then((user) => {
        res.header('x-authentication', user.token).status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
});

router.patch('/user/userUpdate', authenticate, (req,res) => {
    userLibs.updateUser(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
});

router.post('/user/logout', authenticate, (req,res) => {
    let token = req.header('x-authentication');
    userLibs.logOut(token).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.delete('/admin/deactivate/:uuid', authenticate, (req,res) => {
    let body = {
        uuid : req.params.uuid
    }
    userLibs.adminDeActivateUser(body).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.delete('/user/delete/:uuid', authenticate, (req,res) => {
    let body = {
        uuid : req.params.uuid,
        token : req.header('x-authentication')
    }
    userLibs.userDelete(body).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

module.exports = router;