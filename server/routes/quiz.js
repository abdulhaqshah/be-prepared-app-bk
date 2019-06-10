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

router.get('/quiz/getQuizById/:qid', (req, res) => {
    let query = {
        qid : req.params.qid
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

router.get('/quiz/getAllQuizzes', (req, res) => {
    let query = {};
    quizLibs.getQuiz(query).then((quizzes) => {
        res.status(quizzes.status).send(quizzes);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.post('/quiz/addUser', (req, res) => {
    let data = {
        usersId : req.header('uuid'),
        qid : req.body.qid
    }
    quizLibs.addUser(data).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/quiz/getNumberOfUsers', (req, res) => {
    let data = {
        qid : req.body.qid
    };
    quizLibs.numberOfUsers(data).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/quiz/:qid', (req,res) => {
    let data = {
        qid : req.params.qid
    };
    quizLibs.deleteQuiz(data).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;