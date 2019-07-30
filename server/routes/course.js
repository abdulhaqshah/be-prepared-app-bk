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

router.get('/course/:courseId', (req, res) => {
    courseLibs.getCourse({courseId : req.params.courseId}).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.patch('/course/update/:courseId', (req,res) => {
    req.body.updatedBy = req.header('uuid');
    courseLibs.updateCourse({courseId : req.params.courseId}, req.body)
    .then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/course/all', (req, res) => {
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

router.patch('/course/activate/:courseId', (req,res) => {
    courseLibs.changeActivation({courseId : req.params.courseId, active : true}).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.patch('/course/deActivate/:courseId', (req,res) => {
    courseLibs.changeActivation({courseId : req.params.courseId, active : false}).then((course) => {
        res.status(course.status).send(course);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.post('/course/uploadPhoto/:courseId', (req,res) => {
    courseLibs.uploadPhoto(req).then((success) => {
        res.status(success.status).send(success);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

module.exports = router;