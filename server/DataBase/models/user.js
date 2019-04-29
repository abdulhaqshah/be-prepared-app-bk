const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
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
    progress : [{
        course : String,
        totalQuestions : Number,
        completedQuestions : {type : Number, default : 0},
        score : {type : Number, default : 0}
    }],
<<<<<<< HEAD
    deleted : {type : Boolean, default : false},
=======
     tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }],
>>>>>>> Authenticate the user using JWT
    image: {type : String, default : "images/container-bg.png"}
});

UserSchema.pre('save' , function(next){
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err,hash) => {
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})

module.exports = mongoose.model('User', UserSchema);