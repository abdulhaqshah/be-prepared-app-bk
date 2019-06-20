const express = require('express');
const router = express.Router();
const quizLibs = require('../libs/quizlibs');
const {authenticate} = require('./../middleware/authenticate');

router.post('/quiz/new', (req, res) => {
    req.body.createdBy = req.header('uuid');
    quizLibs.createQuiz(req.body).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/quiz/quizById/:quizId', (req, res) => {
    quizLibs.getQuiz({quizId : req.params.quizId, active : true}).then((quiz) => {
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

router.get('/quiz/questionByType/:problemType', (req, res) => {
    quizLibs.getQuestionsByType({problemType : req.params.problemType}).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/quiz/quiz/:quizId/questionById/:questionId', (req, res) => {
    quizLibs.getQuestionsByType({quizId : req.params.quizId}, req.params.questionId).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/quiz/allActive', (req, res) => {
    quizLibs.getQuiz({active : true}).then((quizzes) => {
        res.status(quizzes.status).send(quizzes);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/quiz/allInActive', (req, res) => {
    quizLibs.getQuiz({active : false}).then((quizzes) => {
        res.status(quizzes.status).send(quizzes);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/quiz/:quizId', (req,res) => {
    quizLibs.deleteQuiz({quizId : req.params.quizId}).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.patch('/quiz/activate/:quizId', (req,res) => {
    quizLibs.changeActivation({quizId : req.params.quizId, activeType : true}).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.patch('/quiz/deActivate/:quizId', (req,res) => {
    quizLibs.changeActivation({quizId : req.params.quizId, activeType : false}).then((quiz) => {
        res.status(quiz.status).send(quiz);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;