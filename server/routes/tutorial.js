const express = require('express');
const router = express.Router();
const tutorialLibs = require('../libs/tutoriallibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/tutorial/createTutorial', (req, res) => {
    tutorialLibs.createTutorial(req.body).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/tutorial/getTutorialById/:tid', (req, res) => {
    let query = {
        tid : req.params.tid
    }
    tutorialLibs.getTutorial(query).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/tutorial/addTopic', (req, res) => {
    tutorialLibs.addTopic(req.body).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/tutorial/addLesson', (req, res) => {
    tutorialLibs.addLesson(req.body).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/tutorial/getAllTutorials', (req, res) => {
    let query = {};
    tutorialLibs.getTutorial(query).then((tutorials) => {
        res.status(tutorials.status).send(tutorials);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.post('/tutorial/addUser', (req, res) => {
    let data = {
        usersId : req.header('uuid'),
        tid : req.body.tid
    }
    tutorialLibs.addUser(data).then((tutorials) => {
        res.status(tutorials.status).send(tutorials);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/tutorial/getNumberOfUsers', (req, res) => {
    let data = {
        tid : req.body.tid
    };
    tutorialLibs.numberOfUsers(data).then((tutorials) => {
        res.status(tutorials.status).send(tutorials);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/tutorial/:tid', (req,res) => {
    let data = {
        tid : req.params.tid
    };
    tutorialLibs.deleteTutorial(data).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;