'use strict';

let express = require('express');
let router = express.Router();

// Schemas
let Pizza = require('../Model/pizza');
let Historique = require('../Model/historique');
    
//Require Mongoose
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


// *************************************************
//              Definition des routes
// *************************************************

//GET

/**
 * GET tout les pizzas
 * @route  Route /voir
 * @type   GET
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.get('/voir', function (req, res, next) {
    getPizzas(req, res, next)
})

/**
 * GET une pizza by _id
 * @route  Route /voir/:_id
 * @type   GET
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.get('/voir/:_id', function (req, res, next) {
    getPizzaById(req, res, next)
})

//POST

/**
 * POST (crée) une pizza
 * @route  Route /create
 * @type   POST
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.post('/create', function (req, res, next) {
    postPizza(req, res, next)
})

//PUT

/**
 * PUT (modifie) une pizza
 * @route  Route /modifier
 * @type   PUT
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.put('/modifier', function (req, res, next) {
    putPizza(req, res, next)
});

//DELETE

/**
 * DELETE (supprime) une pizza
 * @route  Route /supprimer
 * @type   DELETE
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.delete('/supprimer/:_id', function (req, res, next) {
    deletePizza(req, res, next)
});


// *************************************************
//            Definition des fonctions
// *************************************************

/** @function
 * @name getPizzas 
 * @description Récupère les pizzas de la base de donnée
 * @returns Array<Pizza>
 */
function getPizzas (req, res, next) {
    Pizza.find({}, null, { sort: { update_at: -1 }})
     .populate('ingredient_ids')
     .exec(function(err, pizzas) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(pizzas);
      }
    });
}

/** @function
 * @name getPizzaById
 * @description Récupère une pizza par _id
 * @returns Pizza
 */
function getPizzaById (req, res, next) {
    Pizza.findOne({_id: req.params._id})
     .populate('ingredient_ids')
     .exec(function(err, pizza) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(pizza);
      }
    });
}

/** @function
 * @name postPizza
 * @description Insère une Pizza en BDD
 * @returns Pizza
 */
function postPizza(req, res, next) {
    let pizzaNew = new Pizza({
        nom             : req.body.nom,
        prix            : req.body.prix,
        description     : req.body.description,
        photo           : req.body.photo,
        ingredient_ids  : req.body.ingredient_ids
    });
    
    pizzaNew.save(function(err, pizza) {
        if (err && err.code == 11000) {
            return res.status(404).send(`Erreur dans la création de votre pizza, veuillez contacter votre administrateur. ${err}`);
        }
        else if (err) { 
            res.status(500);
            res.json({ message: err });
        }
        else {
            res.status(200).json(pizza);
        }
    });
}

/** @function
 * @name putPizza
 * @description Met à jour une Pizza
 * @returns Pizza
 */
function putPizza(req, res, next) {
    Pizza.findOne({_id: req.body._id}, (err, pizza) => {  
        // Gère les erreurs
        if (err) {
            res.status(500);
            res.json({ message: err });
        } else if (pizza) {
            // Pizza à historiser
            let oldObjectUpdated = JSON.stringify(pizza);
            
            // Update seulement les attributs reçus de body
            let pizzaToUpdate = Object.assign(pizza, req.body);
            
            // Update
            Pizza(pizzaToUpdate).save((err, pizzaUpdate) => {
              if (err && err.code == 11000) {
                return res.status(404).send(`Erreur dans la création de votre pizza, veuillez contacter votre administrateur. ${err}`);
              }
              else if (err) { 
                res.status(500);
                res.json({ message: err });
              }
              else {
                // Historise les modifs
                let historique = {type: "Pizza", action: "PUT", oldObject: oldObjectUpdated, newObject: JSON.stringify(pizzaToUpdate)};
                Historique(historique).save((err, todo) => {
                    if (err && err.code == 11000) {
                        return res.status(404).send(`Erreur dans l'historisation de votre pizza, veuillez contacter votre administrateur. ${err}`);
                    }
                    else if (err) { 
                        res.status(500);
                        res.json({ message: err });
                    } else {  
                        Pizza.findOne({_id: pizzaToUpdate._id})
                         .populate('ingredient_ids')
                         .exec(function(err, pizza) {
                          if (err) {
                            return res.status(500).json({message: err });
                          }
                          else {
                            res.status(200).json(pizza);
                          }
                        });
                    }
                });
              }
            });
        } else {
            res.status(500);
            res.json({ message: "Pizza non trouvée" });
        }
    });
}

/** @function
 * @name deletePizza
 * @description Supprime une Pizza en BDD
 * @returns json
 */
function deletePizza(req, res, next) {
    Pizza.findOne({_id: req.params._id})
     .exec(function(err, pizza) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        // Pizza à historiser
        let oldObjectDeleted = JSON.stringify(pizza);
        
        // Historise les modifs
        let historique = {type: "Pizza", action: "DELETE", oldObject: oldObjectDeleted, newObject: ""};
        Historique(historique).save((err, todo) => {
            if (err && err.code == 11000) {
                return res.status(404).send(`Erreur dans l'historisation de votre pizza, veuillez contacter votre administrateur. ${err}`);
            }
            else if (err) { 
                res.status(500);
                res.json({ message: err });
            }
        });
      }
    });
    
    
    Pizza.remove({_id: req.params._id}, (err, pizza) => {  
        // Gère les erreurs
        if (err) {
          res.status(500);
          res.json({ message: err });
        } else {
          res.status(200).json(`OK`);
        }
    });
}

module.exports = router