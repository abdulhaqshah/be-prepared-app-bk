const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let TutorialSchema = new mongoose.Schema({
    tutorialId : {
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
    content : {
        type : String
    },
    description : {
        type : String
    },
    tags : [String],
    category : {type : String},
    createdAt : {type : Date, default : Date.now},
    createdBy : {type : String},
    updatedAt : {type : Date, default : Date.now},
    updatedBy : {type : String},
    active : {type : Boolean, default : false},
    imageUrl: {type : String, default : "images/container-bg.png"}
});

TutorialSchema.pre('save' , function(next) {
    let tutorial = this;
    tutorial.tutorialId = uuidv4();
    next();
});

module.exports = mongoose.model('Tutorial', TutorialSchema);