const express = require('express');
const router = express.Router();
const courseLibs = require('../libs/courselibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/course/createCourse', (req, res) => {
    courseLibs.createCourse(req.body).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/course/getCourseById', (req, res) => {
    let query = {
        cid : req.body.cid
    }
    courseLibs.getCourse(query).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/course/addQuestion', (req, res) => {
    courseLibs.addQuestion(req.body).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/course/getQuestionByType', (req, res) => {
    let data = req.body;
    courseLibs.getQuestionsByType(data).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

module.exports = router;