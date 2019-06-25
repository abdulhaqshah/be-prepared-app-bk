const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let QuizSchema = new mongoose.Schema({
    quizId : {
        type : String,
        unique : true
    },
    courseId : {type : String},
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    questions :[{
        questionId : {type : String},
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
    createdAt : {type : Date, default : Date.now},
    createdBy : {type : String},
    updatedAt : {type : Date, default : Date.now},
    updatedBy : {type : String},
    active : {type : Boolean, default : false},
    imageUrl: {type : String, default : "images/container-bg.png"}
});

QuizSchema.pre('save' , function(next) {
    let quiz = this;
    quiz.quizId = uuidv4();
    next();
});

module.exports = mongoose.model('Quiz', QuizSchema);