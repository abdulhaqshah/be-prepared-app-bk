const Article = require ('./../DataBase/models/article');
const {ObjectID} = require('mongodb');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');

const createArticle = function (data) {
    return new Promise((resolve,reject) => {
        Article.create(data).then((article) => {
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
            if (article && aricle.length > 0) {
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

const addLike = function (data) {
    return new Promise((resolve,reject) => {
        getArticle({articleId : data.articleId}).then((article) => {
            let found = article.likes.find((like) => like === data.userId);
            if (found) {
                reject({
                    status : statusCodes.forBidden,
                    message : `User ${messages.liked}`
                });
            } else {
                Article.findOneAndUpdate({articleId : data.articleId}, {$push : {likes : data.userId}}, {new:true})
                .then((article) => {
                    if (article) {
                        resolve({
                            status : statusCodes.successful,
                            message : `User ${messages.like}`
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
            }
        }).catch((error) => {
            reject(error);
        })
    })
}

const removeLike = function (data) {
    return new Promise((resolve,reject) => {
        Article.findOneAndUpdate({articleId : data.articleId}, {$pull : {likes : data.userId}}, {new : true})
        .then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `User ${messages.unlike}`
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
    })
}

const approvedBy = function (query,data) {
    return new Promise((resolve,reject) => {
        Article.findOneAndUpdate(query, {$set : data}, {new:true})
        .then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `Article ${messages.approved}`
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
    })
}

const updateArticle = function (query, body) {
    return new Promise((resolve,reject) => {
        Article.findOneAndUpdate(query, body, {new:true}).then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `Article ${messages.updated}`,
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
        });
    })
}

module.exports = {createArticle, getArticle, addComment, editComment, getCommentById, deleteComment, addLike, removeLike, approvedBy, updateArticle};