const express = require('express');
const router = express.Router();
const articleLibs = require('../libs/articlelibs');
const {authenticate} = require('../middleware/authenticate');

router.post('/article/newArticle', (req, res) => {
    let data = {
        body : req.body,
        uuid : req.header('uuid')
    }
    articleLibs.createArticle(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/article/articleById/:articleId', (req, res) => {
    let query = {
        articleId : req.params.articleId
    }
    articleLibs.getArticle(query).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/article/articleByTopic', (req, res) => {
    let query = {
        topic : req.body.topic
    }
    articleLibs.getArticle(query).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.patch('/article/addComment', (req, res) => {
    let data = {
        body : req.body,
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

router.get('/article/getComment', (req, res) => {
    let data = req.body;
    articleLibs.getCommentById(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.delete('/article/deleteComment', (req, res) => {
    let data = req.body;
    articleLibs.deleteComment(data).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;