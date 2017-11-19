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

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1', 
    'Authorization':    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRpdGkiLCJpYXQiOjE1MTEwOTgzMTZ9.Ch9t8cumg2KlFcbRtQ6jnBB-abE_OM1fjik5D197CkE',
    'Content-Type':     'application/json'
}

describe('Test historique...', () => {
    it('GET historique', (done) => {
        chaiRequest
            .get('/Historique/voir/')
            .set(headers)
            .end((error, res) => {
                res.should.have.status(200);
                assert.isArray(res.body, "L'historique récupéré est bien un tableau");
                done();
            });
    });
});