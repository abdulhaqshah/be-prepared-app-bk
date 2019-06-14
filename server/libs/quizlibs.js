const Quiz = require('../DataBase/models/quiz');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');
const {checkQuestionType, checkUserId} = require('../utilities/utilityFunctions')

const createQuiz = function (data) {
    return new Promise((resolve,reject) => {
        Quiz.create({
            name : data.name
        }).then((quiz) => {
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

const addQuestion = function (data) {
    return new Promise((resolve,reject) => {
        Quiz.findOneAndUpdate({quizId : data.quizId}, {$push : {questions : data.question}}, {new : true})
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
                    message : `Question ${messages.added}`,
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

module.exports = {createQuiz, getQuiz, addQuestion, getQuestionsByType, deleteQuiz}