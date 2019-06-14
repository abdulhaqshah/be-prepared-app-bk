const Course = require('../DataBase/models/courses');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');
const {checkQuestionType, checkUserId} = require('../utilities/utilityFunctions')

const createCourse = function (data) {
    return new Promise((resolve,reject) => {
        Course.create({
            name : data.name
        }).then((course) => {
            if (course) {
                resolve({
                    status : statusCodes.created,
                    message : `Course ${messages.created}`, 
                    data : course
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

const getCourse = function (query) {
    return new Promise((resolve,reject) => {
        Course.find(query).then((course) => {
            if (course) {
                resolve({
                    status : statusCodes.successful,
                    message : `Course ${messages.found}`, 
                    data : course
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Course ${messages.notFound}`   
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
        Course.findOneAndUpdate({courseId : data.courseId}, {$push : {questions : data.question}}, {new : true})
        .then((course) => {
            if (course) {
                resolve({
                    status : statusCodes.successful,
                    message : `Question ${messages.added}`,
                    data : course
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Course ${messages.notFound}`
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
        Course.find({"questions.problemType" : data.problemType}).then((course) => {
            if (course) {
                let questions = checkQuestionType(course,data.problemType);
                resolve({
                    status : statusCodes.successful,
                    message : `Question ${messages.added}`,
                    data : questions
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Course ${messages.notFound}`
                })
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    })
}

const deleteCourse = function(data) {
    return new Promise ((resolve, reject) => {
        Course.findOneAndDelete(data).then((course) => {
            if (course) {
                resolve({
                    status : statusCodes.successful,
                    message : `Course ${messages.deleted}`
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Course ${messages.notFound}`
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
        Course.findOneAndUpdate({courseId : data.courseId}, {$set : {active : data.activeType}}, {new :true})
        .then((course) => {
            if (course) {
                resolve({
                    status : statusCodes.successful,
                    message : `Course ${messages.activation}`
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Course ${messages.notFound}`
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

module.exports = {createCourse, getCourse, addQuestion, getQuestionsByType, deleteCourse, changeActivation}