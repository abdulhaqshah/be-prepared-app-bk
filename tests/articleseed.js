/*eslint-disable*/
const {ObjectID} = require('mongodb');
const Article = require('../server/DataBase/models/article');
const {secretKeys} = require ('./../server/utilities/constants');

const articleOneID = new ObjectID();
const articleTwoID = new ObjectID();

const articles = [{
    _id : articleOneID,
    topic : 'Topic1',
    article : 'First example',
    publishedBy : 'Example'
},{
    _id : articleTwoID,
    topic: 'Topic2',
    article : 'Second example',
    publishedBy : 'Example'
}]

const populateArticles = () => {
    return Article.remove({}).then(() => {
        let articleOne = new Article(articles[0]).save();
        let articleTwo = new Article(articles[1]).save();
        return Promise.all([articleOne, articleTwo]);
    })
};


module.exports = {articles, populateArticles};