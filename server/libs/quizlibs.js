const Quiz = require('../DataBase/models/quiz');
const {statusCodes, messages} = require ('../utilities/constants');
const uuidv4 = require('uuid/v4');
const {checkQuestionType} = require('../utilities/utilityFunctions');

const createQuiz = function (data) {
    return new Promise((resolve,reject) => {
        Quiz.create(data).then((quiz) => {
            if (quiz) {
                resolve({
                    status : statusCodes.created,
                    message : `Quiz ${messages.created}`, 
                    data : quiz
                })
            } else {
                reject({
                    status : statusCodes.badRequest,
                    message: `${messages.wrong}`   
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const getQuiz = function (query) {
    return new Promise((resolve,reject) => {
        Quiz.find(query).then((quiz) => {
            if (quiz) {
                resolve({
                    status : statusCodes.successful,
                    message : `Quiz ${messages.found}`, 
                    data : quiz
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`   
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const addQuestion = function (query, data) {
    data.question.questionId = uuidv4();
    return new Promise((resolve,reject) => {
        Quiz.findOneAndUpdate(query, {$push : {questions : data.question}}, {new : true})
        .then((quiz) => {
            if (quiz) {
                resolve({
                    status : statusCodes.successful,
                    message : `Question ${messages.added}`,
                    data : quiz
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const addQuestions = function (query, data) {
    data.questions.forEach(function(element) {
        element.questionId = uuidv4();
      });
    return new Promise((resolve,reject) => {
        Quiz.findOneAndUpdate(query, {$push : {questions : {"$each" : data.questions}}}, {new : true})
        .then((quiz) => {
            if (quiz) {
                resolve({
                    status : statusCodes.successful,
                    message : `Question ${messages.added}`,
                    data : quiz
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const getQuestionsByType = function (data) {
    return new Promise((resolve,reject) => {
        Quiz.find({"questions.problemType" : data.problemType}).then((quiz) => {
            if (quiz) {
                let questions = checkQuestionType(quiz,data.problemType);
                resolve({
                    status : statusCodes.successful,
                    message : `Question ${messages.found}`,
                    data : questions
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const getQuestionById = function (query,questionId) {
    return new Promise((resolve,reject) => {
        Quiz.find(query).then((quiz) => {
            if (quiz) {
                let question = quiz.find((question) => question.questionId === questionId);
                resolve({
                    status : statusCodes.successful,
                    message : `Question ${messages.found}`,
                    data : question
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const deleteQuiz = function(data) {
    return new Promise ((resolve, reject) => {
        Quiz.findOneAndDelete(data).then((quiz) => {
            if (quiz) {
                resolve({
                    status : statusCodes.successful,
                    message : `Quiz ${messages.deleted}`
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    })
}

const changeActivation = function (data) {
    return new Promise((resolve,reject) => {
        Quiz.findOneAndUpdate({quizId : data.quizId}, {$set : {active : data.activeType}}, {new :true})
        .then((quiz) => {
            if (quiz) {
                resolve({
                    status : statusCodes.successful,
                    message : `Quiz ${messages.activation}`
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Quiz ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    })
}

module.exports = {createQuiz, getQuiz, addQuestion, addQuestions, getQuestionsByType, deleteQuiz, changeActivation, getQuestionById}