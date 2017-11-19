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

describe('Test CRUD Pyzza...', () => {
    let pizzaCree = null;
    it('POST une pizza', (done) => {
        let pizza = {
            nom: "The Lord of the Rings",
            description: "HAHA Test pizza",
            prix: 20,
            ingredient_ids: []
        }
        chaiRequest
        .post('/pizza/create')
        .set(headers)
        .send(pizza)
        .end((error, res) => {
            res.should.have.status(200);
            assert.isObject(res.body, 'La pizza est un objet.');
            assert.containsAllDeepKeys(res.body, ["nom","description","prix","ingredient_ids"]);
            pizzaCree = res.body;
            done();
        });
      });
      
    it('GET une pizza par _id', (done) => {
        chaiRequest
            .get('/pizza/voir/'+pizzaCree._id)
            .set(headers)
            .end((error, res) => {
                res.should.have.status(200);
                assert.isObject(res.body, 'La pizza est un objet.');
                assert.strictEqual(res.body.nom, pizzaCree.nom, 'Le nom de la pizza retournée est bon');
                assert.strictEqual(res.body.prix, 20, 'Le prix de la pizza retournée est bon');
                done();
            });
      });
      
    it('PUT maj prix d\'une pizza', (done) => {
        chaiRequest
            .get('/pizza/voir/'+pizzaCree._id)
            .set(headers)
            .end((error, res) => {
                res.body.prix = 25;
                chaiRequest
                    .put('/pizza/modifier/')
                    .set(headers)
                    .send(res.body)
                    .end((error2, res2) => {
                        res2.should.have.status(200);
                        assert.isObject(res2.body, 'La pizza est un objet.');
                        assert.strictEqual(res2.body.prix, 25, 'Le prix de la pizza retournée est bon');
                        pizzaCree = res2.body;
                        done();
                    });
            });
      });
      
    it('PUT maj ingrédient d\'une pizza', (done) => {
        // Test ajout ingrédient dans une pizza
            chaiRequest
            .get('/pizza/voir/' + pizzaCree._id)
            .set(headers)
            .end((error, res) => {
                let IngredientAjoute = {
                    nom: "Piment",
                    poids: 2.3,
                    prix: 1.75
                };
                
                chaiRequest
                .post('/Ingredient/create')
                .set(headers)
                .send(IngredientAjoute)
                .end((error2, res2) => {
                    res2.should.have.status(200);
                    assert.isObject(res2.body, "L’Ingredient est un objet.");
                    assert.containsAllKeys(res2.body, ["nom","poids","prix"]);
                    IngredientAjoute = res2.body;
                    pizzaCree.ingredient_ids.push(IngredientAjoute._id);
                    
                    chaiRequest
                    .put('/pizza/modifier/')
                    .set(headers)
                    .send(pizzaCree)
                    .end((error3, res3) => {
                        res3.should.have.status(200);
                        assert.isObject(res3.body, 'La pizza est un objet.');
                        assert.deepEqual([res3.body.ingredient_ids[0]], [IngredientAjoute], 'L\'ingrédient a bien été ajouté');
                        pizzaCree = res3.body;
                        done();
                    });
                });
            });
    })
    
      it('DELETE Pizza', (done) => {
        chaiRequest
            .delete('/pizza/supprimer/' + pizzaCree._id)
            .set(headers)
            .end((error, res) => {
                res.should.have.status(200);
                done();
            });
      });
      
});