const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let CourseSchema = new mongoose.Schema({
    courseId : {
        type : String,
        unique : true
    },
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    description : String,
    createdAt : {type : Date, default : Date.now},
    createdBy : String,
    updatedAt : {type : Date, default : Date.now},
    updatedBy : String,
    active : {type : Boolean, default : false},
    imageUrl: {type : String, default : "images/container-bg.png"}
});

CourseSchema.pre('save' , function(next) {
    let course = this;
    course.courseId = uuidv4();
    next();
});

module.exports = mongoose.model('Course', CourseSchema);