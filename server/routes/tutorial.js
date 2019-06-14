const express = require('express');
const router = express.Router();
const tutorialLibs = require('../libs/tutoriallibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/tutorial/new', (req, res) => {
    tutorialLibs.createTutorial(req.body).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/tutorial/tutorialById/:tutorialId', (req, res) => {
    tutorialLibs.getTutorial({tutorialId : req.params.tutorialId, active : true}).then((tutorial) => {
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

router.get('/tutorial/allActive', (req, res) => {
    tutorialLibs.getTutorial({active : true}).then((tutorials) => {
        res.status(tutorials.status).send(tutorials);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/tutorial/allInActive', (req, res) => {
    tutorialLibs.getTutorial({active : false}).then((tutorials) => {
        res.status(tutorials.status).send(tutorials);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/tutorial/:tutorialId', (req,res) => {
    tutorialLibs.deleteTutorial({tutorialId : req.params.tutorialId}).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;