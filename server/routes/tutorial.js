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

router.get('/tutorial/getTutorialById', (req, res) => {
    let query = {
        tid : req.body.tid
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

module.exports = router;