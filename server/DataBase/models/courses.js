const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let CourseSchema = new mongoose.Schema({
    cid : {
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
        }
    }],
    likes : Number
});

CourseSchema.pre('save' , function(next) {
    let course = this;
    course.cid = uuidv4();
    next();
});

module.exports = mongoose.model('Course', CourseSchema);