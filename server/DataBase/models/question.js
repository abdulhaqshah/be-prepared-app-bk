const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let QuestionSchema = new mongoose.Schema({
    qid : {
        type : String,
        unique : true
    },
    description : {
        type : String,
        required : true
    },
    problemSolving : {
        type : String
    },
    question : {
        type : String,
        required : true,
        unique : true
    },
    options : [String],
    answer : {
        type : String,
        required : true
    },
    likes : Number
});

QuestionSchema.pre('save' , function(next) {
    let question = this;
    question.qid = uuidv4();
    next();
});

module.exports = mongoose.model('Question', QuestionSchema);