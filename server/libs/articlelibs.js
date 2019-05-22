const Article = require ('./../DataBase/models/article');
const {statusCodes, messages, secretKeys, timeScale} = require ('../utilities/constants');

const createArticle = function (data) {
    return new Promise((resolve,reject) => {
        Article.create({
            publishedBy : data.uuid,
            topic : data.body.topic,
            article : data.body.article
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
        Article.findOne(query).then((article) => {
            if (article) {
                resolve({
                    status : statusCodes.successful,
                    message : `Article ${messages.found}`, 
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

module.exports = {createArticle, getArticle};