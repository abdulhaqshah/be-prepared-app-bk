const Tutorial = require('../DataBase/models/tutorials');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');
const {checkUserId} = require('../utilities/utilityFunctions');

const createTutorial = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.create({
            name : data.name
        }).then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.created,
                    message : `Course ${messages.created}`,
                    data : tutorial
                });
            } else {
                reject({
                    status : statusCodes.badRequest,
                    message: `${messages.wrong}`   
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const getTutorial = function (query) {
    return new Promise((resolve,reject) => {
        Tutorial.find(query).then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Tutorial ${messages.found}`, 
                    data : tutorial
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Tutorial ${messages.notFound}`   
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const addTopic = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.findOneAndUpdate({tutorialId : data.tutorialId, active : true}, {$push : {topics : data.topic}}, {new : true})
        .then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Topic ${messages.added}`,
                    data : tutorial
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Tutorial ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const addLesson = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.findOneAndUpdate({tutorialId : data.tutorialId, active : true, "topics._id" : data.topicId}, {$push : {"topics.$.lessons" : data.lesson}}, {new : true})
        .then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Lesson ${messages.added}`,
                    data : tutorial
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Tutorial ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        });
    });
};

const deleteTutorial = function(data) {
    return new Promise ((resolve, reject) => {
        Tutorial.findOneAndDelete(data).then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Tutorial ${messages.deleted}`
                });
            } else {
                reject({
                    status : statusCodes.notFound,
                    message: `Tutorial ${messages.notFound}`
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

module.exports = {createTutorial, getTutorial, addTopic, addLesson, deleteTutorial}