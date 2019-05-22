/*eslint-disable*/
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const defaults = require('superagent-defaults');
const {app} = require('../server/app');
const uuidv4 = require('uuid/v4');
const Article = require('../server/DataBase/models/article');
const {articles, populateArticles} = require('./articleseed');
const {secretKeys} = require ('./../server/utilities/constants');
const {users, populateUsers} = require('./seed');

let articleOne;
let articleTwo;
let userOne;
let userTwo;
beforeEach(() => {
    return populateArticles().then((articles) => {
        articleOne = articles[0];
        articleTwo = articles[1];
        return articles;
    });
});
beforeEach(() => {
    return populateUsers().then((users) => {
        userOne = users[0];
        userTwo = users[1];
        return users;
    });
});
const test = defaults(request(app));

describe('POST /article/newArticle' , () => {
    //it checks whether an article is created as expected
    it('should create a new article' , (done) => {
        let topic = 'Topic';
        let article = 'Article';

        test
        .post('/article/newArticle')
        .set('uuid', userOne.uuid)
        .send({topic,article})
        .expect(201)
        .expect((res) => {
            expect(res.body.data.articleId).toBeTruthy();
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.topic).toBe(topic);
            expect(res.body.data.article).toBe(article);
            expect(res.body.data.publishedBy).toBe(userOne.uuid);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }
            Article.findOne({topic}).then((article) => {
                expect(article).toBeTruthy();
                done();
            });
        });
    });
});

describe('GET /article/articleById/:articleId' , () => {
    //it gives back article after searching using articleId
    it('should return article' , (done) => {
        let articleId = articleOne.articleId;

        test
        .get(`/article/articleById/${articleId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.data.articleId).toBeTruthy();
            expect(res.body.data.articleId).toBe(articleId);
            expect(res.body.data._id).toBeTruthy();
        })
        .end((error) => {
            if (error) {
                return done(error);
            } else {
                done();
            }
        });
    });
});

describe('GET /article/articleByTopic' , () => {
    //it gives back article after searching using topic
    it('should return article' , (done) => {
        let topic = articles[0].topic;

        test
        .get(`/article/articleByTopic`)
        .send({topic})
        .expect(200)
        .expect((res) => {
            expect(res.body.data.articleId).toBeTruthy();
            expect(res.body.data.topic).toBe(topic);
            expect(res.body.data._id).toBeTruthy();
        })
        .end((error) => {
            if (error) {
                return done(error);
            } else {
                done();
            }
        });
    });
});