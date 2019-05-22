const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');


let articleSchema = new mongoose.Schema({
    articleId : {
        type : String,
        unique : true
    },
    publishedBy : {
        type : String,
        required : true
    },
    topic : {
        type : String,
        required : true,
        minlength : 1
    },
    article : {type : String},
    comments : [{
        type : String,
        commentedBy : String
    }]
});

articleSchema.pre('save' , function(next) {
    let article = this;
    article.articleId = uuidv4();
    next();
})

module.exports = mongoose.model('Article', articleSchema);