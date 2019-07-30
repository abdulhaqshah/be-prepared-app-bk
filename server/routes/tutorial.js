const express = require('express');
const router = express.Router();
const tutorialLibs = require('../libs/tutoriallibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/tutorial/new', (req, res) => {
    req.body.createdBy = req.header('uuid');
    tutorialLibs.createTutorial(req.body).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/tutorial/:tutorialId', (req, res) => {
    tutorialLibs.getTutorial({tutorialId : req.params.tutorialId}).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/tutorial/course/:courseId', (req, res) => {
    tutorialLibs.getTutorial({courseId : req.params.courseId}).then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/tutorial/all', (req, res) => {
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

router.patch('/tutorial/update/:tutorialId', (req,res) => {
    req.body.updatedBy = req.header('uuid');
    tutorialLibs.updateTutorial({tutorialId : req.params.tutorialId}, req.body)
    .then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.patch('/tutorial/activate/:tutorialId', (req,res) => {
    tutorialLibs.changeActivation({tutorialId : req.params.tutorialId, active : true})
    .then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.patch('/tutorial/deActivate/:tutorialId', (req,res) => {
    tutorialLibs.changeActivation({tutorialId : req.params.tutorialId, active : false})
    .then((tutorial) => {
        res.status(tutorial.status).send(tutorial);
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

router.post('/tutorial/uploadPhoto/:tutorialId', (req,res) => {
    tutorialLibs.uploadPhoto(req).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

module.exports = router;