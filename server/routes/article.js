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

router.get('/article/:articleId/getArticleById', (req, res) => {
    articleLibs.getArticle({articleId : req.params.articleId}).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.get('/article/:topic/getArticleByTopic', (req, res) => {
    articleLibs.getArticle({topic : req.params.topic}).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/article/addComment', (req, res) => {
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
    articleLibs.editComment(req.body).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

router.get('/article/:aid/comment/:cid', (req, res) => {
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

router.delete('/article/:aid/comment/:cid/delete', (req, res) => {
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

router.get('/article/all', (req, res) => {
    articleLibs.getArticle({}).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
});

router.post('/article/:articleId/like/:userId', (req,res) => {
    articleLibs.addLike({articleId : req.params.articleId, userId : req.params.userId}).then((article) =>{
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/article/:articleId/unlike/:userId', (req,res) => {
    articleLibs.removeLike({articleId : req.params.articleId, userId : req.params.userId})
    .then((article) =>{
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.post('/article/approvedBy/:articleId', (req,res) => {
    articleLibs.addLike({articleId : req.params.articleId}, {approvedBy : req.body.approvedBy})
    .then((article) =>{
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    })
})

router.patch('/article/updateArticle/:aricleId', (req, res) => {
    articleLibs.updateArticle({articleId : req.params.articleId},req.body).then((article) => {
        res.status(article.status).send(article);
    }).catch((error) => {
        res.status(error.status).send(error);
    });
})

module.exports = router;