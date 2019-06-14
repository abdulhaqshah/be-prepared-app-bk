const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let TutorialSchema = new mongoose.Schema({
    tutorialId : {
        type : String,
        unique : true
    },
    name : {
        type : String,
        required : true,
        minlength : 1,
        unique : true
    },
    topics :[{
        heading : {
            type : String,
            required : true
        },
        lessons : [{
            heading : {
                type : String,
                required : true
            },
            content : {
                type : String
            }
        }]
    }],
    active : {type : Boolean, default : false}
});

TutorialSchema.pre('save' , function(next) {
    let tutorial = this;
    tutorial.tutorialId = uuidv4();
    next();
});

module.exports = mongoose.model('Tutorial', TutorialSchema);