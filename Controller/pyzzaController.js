'use strict';

let express = require('express');
let router = express.Router();

// Schemas
let Pizza = require('../Model/pizza');
    
//Require Mongoose
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


// *************************************************
//              Definition des routes
// *************************************************

//GET
router.get('/voir', function (req, res, next) {
    getPizzas(req, res, next)
})

router.get('/voir/:_id', function (req, res, next) {
    getPizzaById(req, res, next)
})

//POST
router.post('/create', function (req, res, next) {
    postPizza(req, res, next)
})

//PUT
router.put('/modifier', function (req, res, next) {
    putPizza(req, res, next)
});

//DELETE
router.delete('/supprimer', function (req, res, next) {
    deletePizza(req, res, next)
});


// *************************************************
//            Definition des fonctions
// *************************************************

function getPizzas (req, res, next) {
    Pizza.find({}, null, { sort: { update_at: -1 }})
     .populate('ingredient_ids')
     .exec(function(err, pizzas) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.header('Access-Control-Allow-Origin','*');
        res.status(200).json(pizzas);
      }
    });
}

function getPizzaById (req, res, next) {
    Pizza.findOne({_id: req.params._id})
     .populate('ingredient_ids')
     .exec(function(err, pizzas) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.header('Access-Control-Allow-Origin','*');
        res.status(200).json(pizzas);
      }
    });
}

function getPizzaByNom (req, res, next) {
    Pizza.findOne({nom: req.params.nom})
     .populate('ingredient_ids')
     .exec(function(err, pizza) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.header('Access-Control-Allow-Origin','*');
        res.status(200).json(pizza);
      }
    });
}

function postPizza(req, res, next) {
    let pizzaNew = new Pizza({
        nom             : req.body.nom,
        prix            : req.body.prix,
        description     : req.body.description,
        ingredient_ids  : req.body.ingredient_ids
    });
    
    pizzaNew.save(function(err) {
        if (err && err.code == 11000) {
            return res.status(404).send(`Erreur dans la création de votre pizza, veuillez contacter votre administrateur. ${err}`);
        }
        else if (err) { 
            res.status(500);
            res.json({ message: err });
        }
        else {
            res.header('Access-Control-Allow-Origin','*');
            res.status(200).json(pizzaNew);
        }
    });
}

function putPizza(req, res, next) {
    Pizza.findOne({_id: req.body._id}, (err, pizza) => {  
        // Gère les erreurs
        if (err) {
            res.status(500);
            res.json({ message: err });
        } else if (pizza){
            // Update seulement les attributs reçus de body
            let pizzaToUpdate = Object.assign(pizza, req.body);
            
            // Update
            Pizza(pizzaToUpdate).save((err, todo) => {
              if (err && err.code == 11000) {
                return res.status(404).send(`Erreur dans la création de votre pizza, veuillez contacter votre administrateur. ${err}`);
              }
              else if (err) { 
                res.status(500);
                res.json({ message: err });
              }
              else {
                res.header('Access-Control-Allow-Origin','*');
                res.status(200).json(pizza);
              }
            });
        } else {
            res.status(500);
            res.json({ message: "Pizza non trouvée" });
        }
    });
}

function deletePizza(req, res, next) {
    Pizza.remove({_id: req.body._id}, (err, pizza) => {  
        // Gère les erreurs
        if (err) {
          res.status(500);
          res.json({ message: err });
        } else {
            res.header('Access-Control-Allow-Origin','*');
            res.status(200).send("Pizza supprimée");
        }
    });
}

module.exports = router