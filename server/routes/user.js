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

router.post('/user/:uuid/quiz/:quizId/start/:courseId', (req,res) => {
    userLibs.addingQuizToUser(
    {
        uuid : req.params.uuid
    }, 
    {
        quizId : req.params.quizId, 
        courseId : req.params.courseId
    }
    )
    .then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/:uuid/quiz/:quizId/updateProgress/:questionId', (req,res) => {
    userLibs.updateQuizProgress({
        uuid : req.params.uuid,
        quizId : req.params.quizId,
        questionId : req.params.questionId,
        answer : req.body.answer
    }).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/user/:uuid/quiz/:quizId/updateStatus', (req,res) => {
    userLibs.quizCompleted({
        uuid : req.params.uuid,
        quizId : req.params.quizId
    }).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/user/:uuid/tutorial/:tutorialId/updateStatus', (req,res) => {
    userLibs.tutorialCompleted({
        uuid : req.params.uuid,
        tutorialId : req.params.tutorialId
    }).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/user/:uuid/tutorial/:tutorialId/start/:courseId', (req,res) => {
    userLibs.addingTutorialToUser(
    {
        uuid : req.params.uuid
    }, 
    {
        tutorialId : req.params.tutorialId, 
        courseId : req.params.courseId
    }
    ).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.get('/user/:uuid/quiz/completed/:courseId', (req,res) => {
    userLibs.getCompletedQuizzes({
        uuid : req.params.uuid,
        courseId : req.params.courseId
    }).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.get('/user/:uuid/tutorial/completed/:courseId', (req,res) => {
    userLibs.getCompletedTutorials({
        uuid : req.params.uuid,
        courseId : req.params.courseId
    }).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/user/:uuid/update/about', (req,res) => {
    userLibs.updateAboutInfo({
        uuid : req.params.uuid
    }, req.body).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})


router.get('/user/emailExist/:email', (req,res) => {
    userLibs.checkByEmail({email : req.params.email}).then((user) => {
        res.status(user.status).send(user);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/user/updatePassword', (req,res) => {
    userLibs.updatePassword(req.body).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

module.exports = router;