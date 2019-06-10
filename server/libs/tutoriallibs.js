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
        Tutorial.findOneAndUpdate({tid : data.tid}, {$push : {topics : data.topic}}, {new : true})
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
        Tutorial.findOneAndUpdate({tid : data.tid, "topics._id" : data.topicId}, {$push : {"topics.$.lessons" : data.lesson}}, {new : true})
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

const addUser = function (data) {
    return new Promise((resolve, reject) => {
        getTutorial({tid : data.tid}).then((tutorial) => {
            if (tutorial) {
                let found = checkUserId(tutorial.data, data.usersId);
                if (found) {
                    reject({
                        status : statusCodes.badRequest,
                        error : `User ${messages.duplicate}`
                    });
                } else {
                    Tutorial.findOneAndUpdate({tid : data.tid}, {$push : {usersIDs : data.usersId}}, {new : true})
                    .then((tutorial) => {
                        if (tutorial) {
                            resolve({
                                status : statusCodes.successful,
                                message : `User ${messages.added}`,
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
                }
            }
        })
    });
};

const numberOfUsers = function (data) {
    return new Promise ((resolve,reject) => {
        getTutorial(data).then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `User ${messages.added}`,
                    numberOfUsers : tutorial.data[0].usersIDs.length
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

module.exports = {createTutorial, getTutorial, addTopic, addLesson, addUser, numberOfUsers, deleteTutorial}