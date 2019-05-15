/*eslint-disable*/
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const defaults = require('superagent-defaults');
const jwt = require('jsonwebtoken');
const {app} = require('../server/app');
const uuidv4 = require('uuid/v4');
const User = require('../server/DataBase/models/user');
const {users, populateUsers, setPayload} = require('./seed');
const {secretKeys} = require ('./../server/utilities/constants');

let userOne;
let userTwo;
beforeEach(() => {
    return populateUsers().then((users) => {
        userOne = users[0];
        userTwo = users[1];
        return users;
    });
});
const test = defaults(request(app));

describe('POST /user/register' , () => {
    //it checks whether a user is created as expected
    it('should create a user' , (done) => {
        let name = 'Asad';
        let email = 'asad@example.com';
        let password = '123456';

        test
        .post('/user/register')
        .send({name,email,password})
        .expect(201)
        .expect((res) => {
            expect(res.body.data.uuid).toBeTruthy();
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            });
        });
    });

    //it checks that a validation error is given back if invalid email is provided
    it('should return validation errors if email invalid', (done) => {
        test
        .post('/user/register')
        .send({
            name : 'Saad',
            email : 'sadad',
            password : 'asd'
        })
        .expect(403)
        .end(done);
    });

    //it checks if email already in use then return error
    it('should not create a user if email is already in use', (done) => {
        test
        .post('/user/register')
        .send({
            name : 'sada',
            email : (users[0].email),
            password : 'Password1'
        })
        .expect(400)
        .end(done);
    });
});

describe('POST /user/login', () => {
    //it checks that user should login as expected if user provides correct email and it's password
    it('should login user', (done) => {
        test
        .post('/user/login')
        .send({
            email : users[1].email,
            password : users[1].password
        })
        .expect(200)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.header['x-authentication']).toBeTruthy(); 
            done();
        });
    });

    //it gives an error if email provided by user doesnot exist in database
    it('shoud reject login if email not found', (done) => {
        test
        .post('/user/login')
        .send({
            email : users[1].email + 'ab',
            password : users[1].password
        })
        .expect(404)
        .end((err,res) =>{
            if(err){
                return done(err);
            }
            done();
        })
    })

    //it gives an error if user provided wrong password for respective email provided
    it('should reject login with invalid password', (done) => {
        test
        .post('/user/login')
        .send({
            email : users[1].email,
            password : users[1].password + '1'
        })
        .expect(403)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            done();  
        });
    });
});

describe('PATCH /user/userUpdate', () => {
    //it should update the user if user is authenticated and sufficient info is provided
    it('should update the user', (done) => {
        let body = {
        uuid : userOne.uuid,
        image : 'folder/image.png',
        name : 'Asad',
        email : 'asad@example.com',
        progress : []
        };
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userOne.uuid)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.image).toBe(body.image);
            expect(res.body.data.name).toBe(body.name);
            expect(res.body.data.email).toBe(body.email);
        })
        .end((error) => {
            if(error){
                done(error);
            } else {
                done();
            }
        })
    })

    //it should update the user if user is authenticated and only valid (name and email) are provided to be changed
    it('should update the user when only credentials are given by user to change', (done) => {
        let uuid = userOne.uuid;
        let name = 'Asad';
        let email = 'asad@example.com';
        let access = 'authentication';
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userOne.uuid)
        .send({uuid,name,email})
        .expect(200)
        .expect((res) => {
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.name).toBe(name);
            expect(res.body.data.email).toBe(email);
        })
        .end((error) => {
            if(error){
                done(error);
            } else {
                done();
            }
        })
    })

    //it should update the user if user is authenticated and valid info is provided
    it('should update the user with the changes provided given that user id is valid and existing', (done) => {
        let uuid = userOne.uuid;
        let name = 'Asaad';
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userOne.uuid)
        .send({uuid,name})
        .expect(200)
        .expect((res) => {
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.name).toBe(name);
        })
        .end((error) => {
            if(error){
                done(error);
            } else {
                done();
            }
        })
    })

    //it should not update the user if user provides empty name field
    it('should reject update if name is empty' , (done) =>{
        let uuid = userTwo.uuid;
        let name = '';
        let email = 'asad@example.com';
        let token = jwt.sign(setPayload(userTwo.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userTwo.uuid)
        .send({uuid,name,email})
        .expect(403)
        .end((err,res) => {
            if(err){
                return done(err);
            } else {
                done();
            }
        });
    })

    //it should not update the user if user is not authenticated
    it('should reject update if id is invalid or not existing' , (done) =>{
        let uuid = userTwo.uuid + 1;
        let email = 'asad@example.com';
        let token = jwt.sign(setPayload(userTwo.uuid)+'1', secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userTwo.uuid)
        .send({uuid,email})
        .expect(401)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '401', message : "Unauthorized"}));
            done(); 
        });
    });

    //it should not update the user if user provides with invalid email address
    it('should reject update if email is invalid' , (done) => {
        let uuid = userTwo.uuid;
        let email = 'asad';
        let token = jwt.sign(setPayload(userTwo.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userTwo.uuid)
        .send({uuid,email})
        .expect(403)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '403', message : "Email is invalid"}));
            done(); 
        });
    });

    //it should not update the user if user provides with an email which is already in use by another user
    it('should reject update if email is already in use' , (done) => {
        let uuid = userTwo.uuid;
        let email = users[0].email;
        let token = jwt.sign(setPayload(userTwo.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userTwo.uuid)
        .send({uuid,email})
        .expect(403)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '403', message : "Email already exists"}));
            done(); 
        });
    });
});

describe('POST /user/logout', () => {
    //it should logout the user if user is authenticated
    it('should logout the user', (done) => {
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
        let uuid = userOne.uuid;

        test
        .post('/user/logout')
        .set('x-authentication', token)
        .set('uuid', uuid)
        .expect(200)
        .expect((res) => {
            expect(res.text).toBe(JSON.stringify({status : '200', message : "User has logout"}));
        })
        .end((error) => {
            if (error) {
                done(error); 
            } else {
                done();
            }
        });
    });

    //it should not allow to logout the user if user is not authenticated
    it('should not logout if token is not for the user uuid' , (done) => {
        let token = jwt.sign(setPayload(userTwo.uuid) + '1', secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

        test
        .patch('/user/userUpdate')
        .set('x-authentication', token)
        .set('uuid', userTwo.uuid)
        .expect(401)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '401', message : "Unauthorized"}));
            done(); 
        });
    });
});

describe('POST /user/changePassword', () => {
    //it should update the user's password after authenticating
    it('should update the password', (done) => {
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
        let uuid = userOne.uuid;
        let password = "passwordchange";

        test
        .post('/user/changePassword')
        .set('x-authentication', token)
        .set('uuid', uuid)
        .send({uuid,password})
        .expect(200)
        .expect((res) => {
            expect(res.body.data.uuid).toBeTruthy();
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.password).not.toBe(password);
        })
        .end((error) => {
            if(error){
                done(error);
            } else {
                done();
            }
        })
    })

    //it should not update the passowrd for the user which is not found
    it('should not update the password', (done) => {
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
        let uuid = userOne.uuid + '1';
        let password = "passwordchange";

        test
        .post('/user/changePassword')
        .set('x-authentication', token)
        .set('uuid', userOne.uuid)
        .send({uuid,password})
        .expect(404)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '404', message : "User has not been found"}));
            done();
        });
    });

});

describe('DELETE /user/delete/:uuid', () => {
    //it should delete the user if user is authenticated
    it('should delete the user', (done) => {
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
        let uuid = userOne.uuid;

        test
        .delete(`/user/delete/${uuid}`)
        .set('x-authentication', token)
        .set('uuid', uuid)
        .expect(200)
        .end((err) => {
            if(err){
                return done(err);
            }
            User.findOne({uuid}).then((user) => {
                expect(user).toBeFalsy();
                done();
            });
        });
    });
    //it should not delete the user if user is not found
    it('should not delete the user' , (done) => {
        let token = jwt.sign(setPayload(userOne.uuid), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
        let uuid = userOne.uuid;

        test
        .delete(`/user/delete/${uuid}1ca`)
        .set('x-authentication', token)
        .set('uuid', uuid)
        .expect(404)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '404', message : "User has not been found"}));
            done(); 
        });
    });
    //it should not delete user if user is not authenticated
    it('should not delete the user' , (done) => {
        let token = jwt.sign(setPayload(userOne.uuid + '1'), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
        let uuid = userOne.uuid;

        test
        .delete(`/user/delete/${uuid}`)
        .set('x-authentication', token)
        .set('uuid', uuid)
        .expect(401)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe(JSON.stringify({status : '401', message : "Unauthorized"}));
            done(); 
        });
    });
});