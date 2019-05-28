const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let TutorialSchema = new mongoose.Schema({
    tid : {
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
        description : {
            type : String,
            required : true
        },
        lessons : [{
            description : {
                type : String,
                required : true
            },
            explanation : {
                type : String
            },
            example : {
                type : String
            }
        }]
    }],
    usersIDs : [String]
});

TutorialSchema.pre('save' , function(next) {
    let tutorial = this;
    tutorial.tid = uuidv4();
    next();
});

module.exports = mongoose.model('Tutorial', TutorialSchema);