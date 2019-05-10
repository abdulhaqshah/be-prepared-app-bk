/*eslint-disable*/
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const defaults = require('superagent-defaults');
const jwt = require('jsonwebtoken');
const {app} = require('../server/app');
const uuidv4 = require('uuid/v4');
const User = require('../server/DataBase/models/user');
const {users, populateUsers, setUuid, setPayload} = require('./seed');
const {secretKeys} = require ('./../server/utilities/constants');

beforeEach(populateUsers);
const test = defaults(request(app));

describe('POST /user/register' , () => {
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
    it('should update the user', (done) => {
        setUuid(0).then((success) => {
            let body = {
            uuid : users[0].uuid,
            image : 'folder/image.png',
            name : 'Asad',
            email : 'asad@example.com',
            progress : []
            };
            let token = jwt.sign(setPayload(0), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[0].uuid)
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
        }).catch((error) => error);
        
    })

    it('should update the user when only credentials are given by user to change', (done) => {
        setUuid(0).then((success) => {
            let uuid = users[0].uuid;
            let name = 'Asad';
            let email = 'asad@example.com';
            let access = 'authentication';
            let token = jwt.sign(setPayload(0), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[0].uuid)
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
        }).catch((error) => error);
    })

    it('should update the user with the changes provided given that user id is valid and existing', (done) => {
        setUuid(0).then((success) => {
            let uuid = users[0].uuid;
            let name = 'Asaad';
            let access = 'authentication';
            let token = jwt.sign(setPayload(0), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[0].uuid)
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
        }).catch((error) => error);
    })

    it('should reject update if name is empty' , (done) =>{
        setUuid(1).then((success) => {
            let uuid = users[1].uuid;
            let name = '';
            let email = 'asad@example.com';
            let access = 'authentication';
            let token = jwt.sign(setPayload(1), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[1].uuid)
            .send({uuid,name,email})
            .expect(403)
            .end((err,res) => {
                if(err){
                    return done(err);
                } else {
                    done();
                }
            });
        }).catch((error) => error)
    })

    it('should reject update if id is invalid or not existing' , (done) =>{
        setUuid(1).then((success) => {
            let uuid = users[1].uuid + 1;
            let email = 'asad@example.com';
            let access = 'authentication';
            let token = jwt.sign(setPayload(1)+'1', secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[1].uuid)
            .send({uuid,email})
            .expect(401)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                expect(res.text).toBe(JSON.stringify({status : '401', message : "Unauthorized"}));
                done(); 
        });
        }).catch((error) => error);
    })

    it('should reject update if email is invalid' , (done) => {
        setUuid(1).then((success) => {
            let uuid = users[1].uuid;
            let email = 'asad';
            let access = 'authentication';
            let token = jwt.sign(setPayload(1), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[1].uuid)
            .send({uuid,email})
            .expect(403)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                expect(res.text).toBe(JSON.stringify({status : '403', message : "Email is invalid"}));
                done(); 
            });
        }).catch((error) => error);
    });

    it('should reject update if email is already in use' , (done) => {
        setUuid(1).then((success) => {
            let uuid = users[1].uuid;
            let email = users[0].email;
            let access = 'authentication';
            let token = jwt.sign(setPayload(1), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[1].uuid)
            .send({uuid,email})
            .expect(403)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                expect(res.text).toBe(JSON.stringify({status : '403', message : "Email already exists"}));
                done(); 
            });
        }).catch((error) => error);
    });
});

describe('POST /user/logout', () => {
    it('should logout the user', (done) => {
        setUuid(0).then((success) => {
            let token = jwt.sign(setPayload(0), secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();
            let uuid = users[0].uuid;

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
            })
        }).catch((error) => error);
    });

    it('should not logout if token is not for the user uuid' , (done) => {
        setUuid(1).then((success) => {
            let token = jwt.sign(setPayload(1) + '1', secretKeys.tokenKey, process.env.JWT_SECRET, {expiresIn: '2d'}).toString();

            test
            .patch('/user/userUpdate')
            .set('x-authentication', token)
            .set('uuid', users[1].uuid)
            .expect(401)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                expect(res.text).toBe(JSON.stringify({status : '401', message : "Unauthorized"}));
                done(); 
            });
        }).catch((error) => error);
    });

})