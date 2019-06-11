const Article = require ('./../DataBase/models/article');
const {ObjectID} = require('mongodb');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');

const createArticle = function (data) {
    return new Promise((resolve,reject) => {
        Article.create({
            publishedBy : data.uuid,
            topic : data.topic,
            article : data.article
        }).then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.created,
                    message : `Article ${messages.created}`, 
                    data : article
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
        })
    })
}

const getArticle = function (query) {
    return new Promise((resolve,reject) => {
        Article.find(query).then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `Article/s ${messages.found}`, 
                    data : article
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `Article ${messages.notFound}`
                });
            }
        }).catch((error) => {
            reject({
                status : statusCodes.badRequest,
                error
            });
        })
    })
}

const addComment = function (data) {
    return new Promise((resolve,reject) => {
        let comment = {
            comment : data.comment,
            commentedBy : data.uuid
        }
        Article.findOneAndUpdate({articleId : data.articleId}, {$push : {comments : comment}}, {new : true}).then((article) => {
            if (article) {
                let coment = article.comments.find((comments) => comments.comment === data.comment);
                resolve({
                    status : statusCodes.successful,
                    message : `Comment ${messages.added}`,
                    data : coment
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `Article ${messages.notFound}`
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

const editComment = function (data) {
    return new Promise((resolve,reject) => {
        Article.findOneAndUpdate({"articleId": data.articleId, "comments._id" : data.commentId} , {$set : {"comments.$.comment" : data.comment}}, {new:true})
        .then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `Comment ${messages.updated}`
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `Comment ${messages.notFound}`
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

const getCommentById = function (data) {
    return new Promise((resolve,reject) => {
        Article.findOne({"articleId": data.articleId, "comments._id" : data.commentId}).then((article) => {
            if (article) {
                let comment = article.comments.find((comments) => JSON.stringify(comments._id) === JSON.stringify(data.commentId));
                resolve({
                    status : statusCodes.successful,
                    message : `Comment ${messages.found}`,
                    data : comment
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `Comment ${messages.notFound}`
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

const deleteComment = function (data) {
    return new Promise((resolve,reject) => {
        Article.findOneAndUpdate({"articleId": data.articleId, "comments._id" : data.commentId} , {$pull : {"comments" : {_id : data.commentId}}}, {multi:true})
        .then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `Comment ${messages.deleted}`
                })
            } else {
                reject({
                    status : statusCodes.notFound,
                    message : `Comment ${messages.notFound}`
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

module.exports = {createArticle, getArticle, addComment, editComment, getCommentById, deleteComment};