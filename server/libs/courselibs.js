const Course = require('../DataBase/models/courses');
const {statusCodes, messages, imageFolder} = require ('../utilities/constants');
const {checkQuestionType, checkUserId} = require('../utilities/utilityFunctions');
const formidable = require('formidable');

const createCourse = function (data) {
    return new Promise((resolve,reject) => {
        Course.create(data).then((course) => {
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
            if(error.code === 11000) {
                reject({
                    status : statusCodes.badRequest,
                    message: `Course ${messages.duplicate}`   
                })
            }
            reject({
                status : statusCodes.badRequest,
                error
            });
        })
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

const updateCourse = function (query, body) {
    return new Promise((resolve,reject) => {
        body.updatedAt = Date.now();
        Course.findOneAndUpdate(query, body, {new:true}).then((course) => {
            if (course) {
                resolve({
                    status : statusCodes.successful,
                    message : `Course ${messages.updated}`,
                    data : course
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
};

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
        Course.findOneAndUpdate({courseId : data.courseId}, {$set : {active : data.active}}, {new :true})
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

const uploadPhoto = function(req) {
    let id = req.params.courseId;
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
            Course.findOneAndUpdate({courseId : id}, {$set :{"imageUrl" : file.photo.path}}, {new: true}, (error, doc) => {
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

module.exports = {createCourse, getCourse, deleteCourse, changeActivation, uploadPhoto, updateCourse}