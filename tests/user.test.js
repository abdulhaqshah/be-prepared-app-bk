/*eslint-disable*/
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server/app');
const User = require('../server/DataBase/models/user');
const {users, populateUsers} = require('./seed');

beforeEach(populateUsers);

describe('POST /user/register' , () => {
    it('should create a user' , (done) => {
        let name = 'Asad';
        let email = 'asad@example.com';
        let password = '123456';

        request(app)
        .post('/user/register')
        .send({name,email,password})
        .expect(201)
        .expect((res) => {
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
        request(app)
        .post('/user/register')
        .send({
            name : 'Saad',
            email : 'sadad',
            password : 'asd'
        })
        .expect(400)
        .end(done);
    });

    it('should not create a user if email is already in use', (done) => {
        request(app)
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
        request(app)
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
            done();
        });
    });

    it('shoud reject login if email not found', (done) => {
        request(app)
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
        request(app)
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
        let body = {
            id : users[0]._id,
            image : 'folder/image.png',
            name : 'Asad',
            email : 'asad@example.com',
            progress : []
        }

        request(app)
        .patch('/user/userUpdate')
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
            }
            done();
        })
    })

    it('should update the user when credentials are given by user to change', (done) => {
        let id = users[0]._id;
        let name = 'Asad';
        let email = 'asad@example.com';

        request(app)
        .patch('/user/userUpdate')
        .send({id,name,email})
        .expect(200)
        .expect((res) => {
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.name).toBe(name);
            expect(res.body.data.email).toBe(email);
        })
        .end((error) => {
            if(error){
                done(error);
            }
            done();
        })
    })

    it('should update the user with the changes provided given that user id is valid and existing', (done) => {
        let id = users[0]._id;
        let name = 'Asaad';

        request(app)
        .patch('/user/userUpdate')
        .send({id,name})
        .expect(200)
        .expect((res) => {
            expect(res.body.data._id).toBeTruthy();
            expect(res.body.data.name).toBe(name);
        })
        .end((error) => {
            if(error){
                done(error);
            }
            done();
        })
    })

    it('should reject update if name is empty' , (done) =>{
        let id = users[1]._id;
        let name = '';
        let email = 'asad@example.com';

        request(app)
        .patch('/user/userUpdate')
        .send({id,name,email})
        .expect(403)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            done(); 
        });
    })

    it('should reject update if id is invalid or not existing' , (done) =>{
        let id = users[1]._id + 1;
        let email = 'asad@example.com';

        request(app)
        .patch('/user/userUpdate')
        .send({id,email})
        .expect(404)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe('User has not been found');
            done(); 
        });
    })

    it('should reject update if email is invalid' , (done) =>{
        let id = users[1]._id;
        let email = 'asad';

        request(app)
        .patch('/user/userUpdate')
        .send({id,email})
        .expect(403)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            expect(res.text).toBe('Email is invalid');
            done(); 
        });
    });
});