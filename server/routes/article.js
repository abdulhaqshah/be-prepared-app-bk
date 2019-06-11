const express = require('express');
const router = express.Router();
const articleLibs = require('../libs/articlelibs');
const {authenticate} = require('../middleware/authenticate');

router.post('/article/', (req, res) => {
    let data = {
        topic : req.body.topic,
        article : req.body.article,
        uuid : req.header('uuid')
    }
    articleLibs.createArticle(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/article/:articleId', (req, res) => {
    let query = {
        articleId : req.params.articleId
    }
    articleLibs.getArticle(query).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/article/:topic', (req, res) => {
    let query = {
        topic : req.params.topic
    }
    articleLibs.getArticle(query).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.patch('/article/addComment', (req, res) => {
    let data = {
        comment : req.body.comment,
        articleId : req.body.articleId,
        uuid : req.header('uuid')
    }
    articleLibs.addComment(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.patch('/article/editComment', (req, res) => {
    let data = req.body;
    articleLibs.editComment(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/article/getCommentById/:aid/:cid', (req, res) => {
    let data = {
        articleId : req.params.aid,
        commentId : req.params.cid
    }
    articleLibs.getCommentById(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/article/deleteComment/:aid/:cid', (req, res) => {
    let data = {
        articleId : req.params.aid,
        commentId : req.params.cid
    }
    articleLibs.deleteComment(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/article/getAllArticles', (req, res) => {
    let query = {};
    articleLibs.getArticle(query).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

module.exports = router;