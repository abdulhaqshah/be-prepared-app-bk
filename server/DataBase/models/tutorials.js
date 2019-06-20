const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let TutorialSchema = new mongoose.Schema({
    tutorialId : {
        type : String,
        unique : true
    },
    courseId : String,
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    content : {
        type : String
    },
    tags : [String],
    category : String,
    createdAt : {type : Date, default : Date.now},
    createdBy : String,
    updatedAt : {type : Date, default : Date.now},
    updatedBy : String,
    active : {type : Boolean, default : false},
    imageUrl: {type : String, default : "images/container-bg.png"}
});

TutorialSchema.pre('save' , function(next) {
    let tutorial = this;
    tutorial.tutorialId = uuidv4();
    next();
});

module.exports = mongoose.model('Tutorial', TutorialSchema);