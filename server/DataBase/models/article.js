const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let articleSchema = new mongoose.Schema({
    articleId : {
        type : String,
        unique : true
    },
    publishedBy : {
        name : {
            type : String,
            required : true 
        },
        id : {
            type : String,
            required : true 
        }
    },
    title : {
        type : String,
        required : true,
        minlength : 1
    },
    content : {type : String},
    comments : [{
        comment : {type : String},
        commentedBy : {type : String}
    }],
    likes : [String],
    approvedBy : {
        name : {
            type : String,
            required : true 
        },
        id : {
            type : String,
            required : true 
        }
    }
});

articleSchema.pre('save' , function(next) {
    let article = this;
    article.articleId = uuidv4();
    next();
})

module.exports = mongoose.model('Article', articleSchema);