const mongoose = require('mongoose');
const validator = require('validator');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');


let UserSchema = new mongoose.Schema({
    uuid : {
        type : String,
        unique : true
    },
    name : {
        type : String,
        required : true,
        minlength : 1
    },
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true,
        validate : {
            validator : validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        required: true,
        minlength : 6
    },
    quizProgress : [{
        name : {type : String},
        description : {type : String},
        quizId : {type : String},
        courseId : {type : String},
        attempted : {type : Number},
        correct : {type : Number},
        completed : {type : Boolean, default : false}
    }],
    tutorialProgress : [{
        name : {type : String},
        description : {type : String},
        tutorialId : {type : String},
        courseId : {type : String},
        completed : {type : Boolean, default : false}
    }],
    about : {type : String},
    deActivate : {type : Boolean, default : false},
    deActivatedAt : {type : Date, default : null},
    deActivatedBy : {type : String, default : ''},
    updatedAt : {type : Date, default : Date.now},
    isAdmin : {type : Boolean, default : false},
    image: {type : String, default : "images/container-bg.png"}
});

UserSchema.pre('save' , function(next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err,hash) => {
                user.password = hash;
                next();
            })
        })
        user.uuid = uuidv4();
    } else {
        next();
    }
})

module.exports = mongoose.model('User', UserSchema);