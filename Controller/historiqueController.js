'use strict';

let express = require('express');
let router = express.Router();

// Schemas
let Historique = require('../Model/historique');
    
//Require Mongoose
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


// *************************************************
//              Definition des routes
// *************************************************

//GET
router.get('/voir', function (req, res, next) {
    getHistorique(req, res, next)
})


// *************************************************
//            Definition des fonctions
// *************************************************

function getHistorique (req, res, next) {
    Historique.find({}, null, { sort: { update_at: -1 }})
     .exec(function(err, pizzas) {
      if (err) {
        return res.status(500).json({message: err });
      }
      else {
        res.status(200).json(pizzas);
      }
    });
}

module.exports = router