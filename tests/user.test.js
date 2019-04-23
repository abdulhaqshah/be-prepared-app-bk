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