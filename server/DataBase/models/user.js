const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const fs = require('fs');
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
    image: {type : String, default : "images/container-bg.png"}
});

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['name', '_id', 'email', 'image', 'progress']);
}

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



let User = mongoose.model('User', UserSchema);

module.exports = {User};