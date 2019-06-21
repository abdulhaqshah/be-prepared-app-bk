const Tutorial = require('../DataBase/models/tutorials');
const {statusCodes, messages, imageFolder} = require ('../utilities/constants');
const {checkUserId} = require('../utilities/utilityFunctions');
const formidable = require('formidable');

const createTutorial = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.create(data).then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.created,
                    message : `Tutorial ${messages.created}`,
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
            if (tutorial && tutorial.length > 0) {
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

const addTags = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.findOneAndUpdate({tutorialId : data.tutorialId, active : true}, {$push : {tags : {"$each": data.tags}}}, {new : true})
        .then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Tags ${messages.added}`,
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

const removeTags = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.findOneAndUpdate({tutorialId : data.tutorialId, active : true}, {$pull : {tags : {"$each": data.tags}}}, {new : true})
        .then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Tags ${messages.added}`,
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

const updateTutorial = function (query, body) {
    return new Promise((resolve,reject) => {
        body.updatedAt = Date.now();
        Tutorial.findOneAndUpdate(query, body, {new:true}).then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Tutorial ${messages.updated}`,
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
    })
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

const changeActivation = function (data) {
    return new Promise((resolve,reject) => {
        Tutorial.findOneAndUpdate({tutorialId : data.tutorialId}, {$set : {active : data.active}}, {new :true})
        .then((tutorial) => {
            if (tutorial) {
                resolve({
                    status : statusCodes.successful,
                    message : `Tutorial ${messages.activation}`
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

const uploadPhoto = function(req) {
    let id = req.params.tutorialId;
    let form = new formidable.IncomingForm();
    form.uploadDir = imageFolder.tutorialPath;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    return new Promise((resolve,reject) => {
        form.parse(req, (error, fields, file) => {
            if(error){
                reject({
                    status : statusCodes.badRequest,
                    error
                })
            }
            Tutorial.findOneAndUpdate({tutorialId : id}, {$set :{"imageUrl" : file.photo.path}}, {new: true}, (error, doc) => {
                if (doc) {
                    resolve({
                        status : statusCodes.successful,
                        message : `Photo ${messages.updated}`, 
                        data : {
                            path : file.photo.path,
                            type : file.photo.type
                        }
                    });
                } else {
                    reject({
                        status : statusCodes.badRequest,
                        data : 'error'   
                    })
                }
            })
        })
    })
};

module.exports = {createTutorial, getTutorial, deleteTutorial, removeTags, changeActivation, addTags, updateTutorial, uploadPhoto}