const express = require('express');
const router = express.Router();
const courseLibs = require('../libs/courselibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/course/new', (req, res) => {
    courseLibs.createCourse(req.body).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/course/courseById/:courseId', (req, res) => {
    courseLibs.getCourse({courseId : req.params.courseId, active : true}).then((course) => {
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

router.get('/course/questionByType/:problemType', (req, res) => {
    courseLibs.getQuestionsByType({problemType : req.params.problemType}).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/course/allActive', (req, res) => {
    courseLibs.getCourse({active : true}).then((courses) => {
        res.status(courses.status).send(courses);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/course/allInActive', (req, res) => {
    courseLibs.getCourse({active : false}).then((courses) => {
        res.status(courses.status).send(courses);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/course/:courseId', (req,res) => {
    courseLibs.deleteCourse({courseId : req.params.courseId}).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;