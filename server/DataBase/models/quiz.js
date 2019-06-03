const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let QuizSchema = new mongoose.Schema({
    qid : {
        type : String,
        unique : true
    },
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    questions :[{
        problemType: {
            type : String
        },
        question : {
            type : String,
            required : true
        },
        options : [String],
        answer : {
            type : String,
            required : true
        }
    }],
    usersIDs : [String]
});

QuizSchema.pre('save' , function(next) {
    let quiz = this;
    quiz.qid = uuidv4();
    next();
});

module.exports = mongoose.model('Quiz', QuizSchema);