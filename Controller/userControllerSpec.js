'use strict';

let chai = require('chai');
let { assert } = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
let chaiRequest = chai.request(server);

let baseURL = "https://pyzza-timadr.c9users.io/";
    
//Require Mongoose
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const { exec } = require('child_process');
var request = require('request');
const jwt = require('jsonwebtoken');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1', 
    'Authorization':    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRpdGkiLCJpYXQiOjE1MTEwOTgzMTZ9.Ch9t8cumg2KlFcbRtQ6jnBB-abE_OM1fjik5D197CkE',
    'Content-Type':     'application/json'
}

describe('Test user...', () => {
    it('GET user token and test if ok', (done) => {
        let credentials = { username: 'titi', password: 'mdp' };
        chaiRequest
            .post('/login')
            .send(credentials)
            .end((error, res) => {
                res.should.have.status(200);
                assert.equal(jwt.decode(res.body, 'Etre secret ou ne pas letre').username, 'titi');
                done();
            });
    });
});