const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let QuizSchema = new mongoose.Schema({
    quizId : {
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
        answer : [{
            type : String,
            required : true
        }],
        selection : {
            type : String,
            required : true,
            default : "single"
        }
    }],
    active : {type : Boolean, default : false}
});

QuizSchema.pre('save' , function(next) {
    let quiz = this;
    quiz.quizId = uuidv4();
    next();
});

module.exports = mongoose.model('Quiz', QuizSchema);