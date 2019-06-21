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
    description : {type : String},
    createdAt : {type : Date, default : Date.now},
    createdBy : {type : String},
    updatedAt : {type : Date, default : Date.now},
    updatedBy : {type : String},
    active : {type : Boolean, default : false},
    imageUrl: {type : String, default : "images/container-bg.png"}
});

CourseSchema.pre('save' , function(next) {
    let course = this;
    course.courseId = uuidv4();
    next();
});

module.exports = mongoose.model('Course', CourseSchema);