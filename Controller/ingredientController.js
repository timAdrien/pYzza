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
router.get('/voir', function (req, res, next) {
    if (!req.body._id)
        getIngredients(req, res, next)
    else 
        getIngredient(req, res, next)
})

router.get('/voir/:nom', function (req, res, next) {
    getIngredientByNom(req, res, next)
})

//POST
router.post('/create', function (req, res, next) {
    postIngredient(req, res, next)
})

//PUT
router.put('/modifier', function (req, res, next) {
    putIngredient(req, res, next)
});

//DELETE
router.delete('/supprimer', function (req, res, next) {
    deleteIngredient(req, res, next)
});


// *************************************************
//            Definition des fonctions
// *************************************************

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

function getIngredient (req, res, next) {
    Ingredient.findOne({_id: req.body._id})
     .exec(function(err, Ingredients) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(Ingredients);
      }
    });
}

function getIngredientByNom (req, res, next) {
    Ingredient.findOne({nom: req.params.nom})
     .exec(function(err, Ingredient) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(Ingredient);
      }
    });
}

function postIngredient(req, res, next) {
    let IngredientNew = new Ingredient({
        nom             : req.body.nom,
        prix            : req.body.prix,
        poids           : req.body.poids
    });
    
    IngredientNew.save(function(err) {
        if (err && err.code == 11000) {
            return res.status(404).send(`Erreur dans la création de votre Ingredient, veuillez contacter votre administrateur. ${err}`);
        }
        else if (err) { 
            res.status(500);
            res.json({ message: err });
        }
        else {
            res.status(200).json(IngredientNew);
        }
    });
}

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
           Ingredient(IngredientToUpdate).save((err, todo) => {
              if (err && err.code == 11000) {
                return res.status(404).send(`Erreur dans la création de votre Ingredient, veuillez contacter votre administrateur. ${err}`);
              }
              else if (err) { 
                res.status(500);
                res.json({ message: err });
              }
              else {
                res.status(200).json(IngredientRes);
              }
            });
        } else {
            res.status(500);
            res.json({ message: "Ingredient non trouvée" });
        }
    });
}

function deleteIngredient(req, res, next) {
    Ingredient.remove({_id: req.body._id}, (err, Ingredient) => {  
        // Gère les erreurs
        if (err) {
          res.status(500);
          res.json({ message: err });
        } else {
            res.status(200).send("Ingredient supprimée");
        }
    });
}

module.exports = router