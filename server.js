/**
 * @file server.js
 * @desc Point d'entrée de l'application 'Pyzza'. <br />
 * L'application Pyzza permet de gérer entièrement nos pizzas. <br />
 *
 * @version 1.7.0
 *
 * @author Timothée ADRIEN <timothee.adrien@ynov.com>
 *
 */

'use strict';

// Require des modules
const path       = require('path');
const express    = require('express');
const app        = express();
const http       = require('http').Server(app);
const bodyParser = require('body-parser');
const colors     = require('colors');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

// Déclaration du port utilisé
const port = process.env.PORT || 3000;

// MONGOOSE
// Import du module Mongoose
var mongoose = require('mongoose');

// Setup de la connexion à Mongoose
var mongoDB = 'mongodb://localhost/pyzzaDB';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

// Get la connexion Mongoose
var db = mongoose.connection;

// Bind d'Event pour les erreurs
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB'));
db.once('open', function() {
  console.log("Connexion à MongoDB établie.")
});


// General Conf
// Config pour gérer en partie les requêtes AJAX
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'View')));
app.use(express.static(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist')));
// Lancement de JWT (JSON Web token)
app.use(expressJWT({ secret: 'Etre secret ou ne pas letre'}).unless({ path: ['/login']}));

// Require Controllers
const Pizza = require('./Controller/pyzzaController');
const Ingredient = require('./Controller/ingredientController');
const User = require('./Controller/userController');
const Historique = require('./Controller/historiqueController');

// Conf Routes
app.use('/pizza', Pizza);
app.use('/ingredient', Ingredient);
app.use('/login', User);
app.use('/historique', Historique);
app.use(express.static(path.join(__dirname, 'public')));

// Lancement du server
let server = app.listen(port, () => {
    console.log(`Démarrage du serveur sur le port: ${port}`);
});

// Démarrage de l'écoute des socket sur le serveur 
var io = require('socket.io').listen(server);
var ioSocket = require('./Socket/socket')(io);


/** @function
 * @name stop
 * @description Arrête le serveur
 */
function stop() {
    server.close();
}

module.exports = app;
module.exports.stop = stop;