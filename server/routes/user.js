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

router.delete('/user/deactivate/:uuid', authenticate, (req,res) => {
    let data = {
        uuid : req.params.uuid
    }
    userLibs.deActivateUser(data).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.delete('/user/delete/:uuid', authenticate, (req,res) => {
    let data = {
        uuid : req.params.uuid,
        token : req.header('x-authentication')
    }
    userLibs.deleteUser(data).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/changePassword', authenticate, (req,res) => {
    userLibs.changePassword(req.body).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/uploadPhoto/:uuid', authenticate, (req,res) => {
    userLibs.uploadPhoto(req).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/addQuizForProgress', (req,res) => {
    userLibs.addQuizIdForProgress({uuid : req.body.uuid}, req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/updateQuizProgress', (req,res) => {
    userLibs.updateQuizProgress(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/user/updateQuizStatus', (req,res) => {
    userLibs.quizCompleted(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/user/updateTutorialStatus', (req,res) => {
    userLibs.tutorialCompleted(req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/addTutorialForProgress', (req,res) => {
    userLibs.addTutorialIdForProgress({uuid : req.body.uuid}, req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.get('/user/getCompletedQuizzes', (req,res) => {
    userLibs.getCompletedQuizzes({uuid : req.body.uuid}, req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.get('/user/getCompletedTutorials', (req,res) => {
    userLibs.getCompletedTutorials({uuid : req.body.uuid}, req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

module.exports = router;