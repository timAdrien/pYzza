'use strict';

let express = require('express');
let router = express.Router();

// Schemas
let Ingredient = require('../Model/ingredient');
    
//Require Mongoose
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


// *************************************************
//              Definition des routes
// *************************************************


//GET

/**
 * GET tout les ingrédients
 * @route  Route /voir
 * @type   GET
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.get('/voir', function (req, res, next) {
    getIngredients(req, res, next)
})

/**
 * GET un ingrédient by _id
 * @route  Route /voir/:_id
 * @type   GET
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.get('/voir/:_id', function (req, res, next) {
    getIngredient(req, res, next)
})


//POST

/**
 * POST (crée) un ingrédient
 * @route  Route /create
 * @type   POST
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.post('/create', function (req, res, next) {
    postIngredient(req, res, next)
})


//PUT

/**
 * PUT (modifie) un ingrédient
 * @route  Route /modifier
 * @type   PUT
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.put('/modifier', function (req, res, next) {
    putIngredient(req, res, next)
});


//DELETE

/**
 * DELETE (supprime) un ingrédient
 * @route  Route /supprimer
 * @type   DELETE
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.delete('/supprimer', function (req, res, next) {
    deleteIngredient(req, res, next)
});


// *************************************************
//            Definition des fonctions
// *************************************************

/** @function
 * @name getIngredients 
 * @description Récupère les ingrédients de la base de donnée
 * @returns Array<Ingredient>
 */
function getIngredients (req, res, next) {
    Ingredient.find({}, null, { sort: { update_at: -1 }})
     .exec(function(err, Ingredients) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(Ingredients);
      }
    });
}

/** @function
 * @name getIngredient
 * @description Récupère un ingrédient par _id
 * @returns Ingredient
 */
function getIngredient (req, res, next) {
    Ingredient.findOne({_id: req.params._id})
     .exec(function(err, ingredientFound) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(ingredientFound);
      }
    });
}

/** @function
 * @name postIngredient
 * @description Insère un Ingrédient en BDD
 * @returns Ingredient
 */
function postIngredient(req, res, next) {
    let IngredientNew = new Ingredient({
        nom             : req.body.nom,
        prix            : req.body.prix,
        poids           : req.body.poids
    });
    
    IngredientNew.save(function(err, ingredient) {
        if (err && err.code == 11000) {
            return res.status(404).send(`Erreur dans la création de votre Ingredient, veuillez contacter votre administrateur. ${err}`);
        }
        else if (err) { 
            res.status(500);
            res.json({ message: err });
        }
        else {
            res.status(200).json(ingredient);
        }
    });
}

/** @function
 * @name putIngredient
 * @description Met à jour un Ingrédient
 * @returns Ingredient
 */
function putIngredient(req, res, next) {
    Ingredient.findOne({_id: req.body._id}, (err, IngredientRes) => {  
        // Gère les erreurs
        if (err) {
            res.status(500);
            res.json({ message: err });
        } else if (IngredientRes){
            // Update seulement les attributs reçus de body
            let IngredientToUpdate = Object.assign(IngredientRes, req.body);
            
            // Update
           Ingredient(IngredientToUpdate).save((err, ingredient) => {
              if (err && err.code == 11000) {
                return res.status(404).send(`Erreur dans la création de votre Ingredient, veuillez contacter votre administrateur. ${err}`);
              }
              else if (err) { 
                res.status(500);
                res.json({ message: err });
              }
              else {
                res.status(200).json(ingredient);
              }
            });
        } else {
            res.status(500);
            res.json({ message: "Ingredient non trouvée" });
        }
    });
}

/** @function
 * @name deleteIngredient
 * @description Supprime un Ingrédient en BDD
 * @returns json
 */
function deleteIngredient(req, res, next) {
    Ingredient.remove({_id: req.body._id}, (err, Ingredient) => {  
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