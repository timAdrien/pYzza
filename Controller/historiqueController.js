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

/**
 * GET tout l'historique de modification des pizzas
 * @route  Route /voir
 * @type   GET
 * @param  {Request} Parametre de la requete entrante
 * @param  {Response} Parametre de la reponse
 * @param  {Function} Reference de la prochaine fonction à éxecuter
 */
router.get('/voir', function (req, res, next) {
    getHistorique(req, res, next)
})


// *************************************************
//            Definition des fonctions
// *************************************************

/** @function
 * @name getHistorique 
 * @description Récupère toutes les modification enregistrées en BDD base de donnée
 * @returns Array<Historique>
 */
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