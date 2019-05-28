const express = require('express');
const router = express.Router();
const quizLibs = require('../libs/quizlibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/quiz/createQuiz', (req, res) => {
    quizLibs.createQuiz(req.body).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/quiz/getQuizById', (req, res) => {
    let query = {
        qid : req.body.qid
    }
    quizLibs.getQuiz(query).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/quiz/addQuestion', (req, res) => {
    quizLibs.addQuestion(req.body).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/quiz/getQuestionByType', (req, res) => {
    let data = req.body;
    quizLibs.getQuestionsByType(data).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

module.exports = router;