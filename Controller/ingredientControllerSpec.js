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

describe('Test CRUD Ingredient...', () => {
    let IngredientCree = null;
    it('POST une Ingredient', (done) => {
        let Ingredient = {
            nom: "Haricot",
            poids: 12.3,
            prix: 2
        }
        chaiRequest
        .post('/Ingredient/create')
        .set(headers)
        .send(Ingredient)
        .end((error, res) => {
            res.should.have.status(200);
            assert.isObject(res.body, "L'Ingredient est un objet.");
            assert.containsAllDeepKeys(res.body, ["nom","poids","prix"]);
            IngredientCree = res.body;
            done();
        });
      });
      
    it('GET une Ingredient par _id', (done) => {
        chaiRequest
            .get('/Ingredient/voir/' + IngredientCree._id)
            .set(headers)
            .end((error, res) => {
                res.should.have.status(200);
                assert.isObject(res.body, 'La Ingredient est un objet.');
                assert.strictEqual(res.body.nom, IngredientCree.nom, 'Le nom de la Ingredient retournée est bon');
                done();
            });
      });
      
    it('PUT maj prix d\'une Ingredient', (done) => {
        chaiRequest
            .get('/Ingredient/voir/' + IngredientCree._id)
            .set(headers)
            .end((error, res) => {
                res.body.prix = 2.5;
                chaiRequest
                    .put('/Ingredient/modifier/')
                    .set(headers)
                    .send(res.body)
                    .end((error2, res2) => {
                        res2.should.have.status(200);
                        assert.isObject(res2.body, 'L\'ingredient est un objet.');
                        assert.strictEqual(res2.body.prix, 2.5, 'Le prix de la Ingredient retournée est bon');
                        IngredientCree = res2.body;
                        done();
                    });
            });
      });
      
      it('DELETE Ingredient', (done) => {
        chaiRequest
            .delete('/Ingredient/supprimer/')
            .set(headers)
            .send(IngredientCree)
            .end((error, res) => {
                res.should.have.status(200);
                done();
            });
      });
});