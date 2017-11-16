/**
 * @file server.js
 * @desc Point d'entrée de l'application 'Pyzza'. <br />
 * L'application Pyzza permet de gérer entièrement nos pizzas. <br />
 *
 * @version Alpha 1.0.0
 *
 * @author Timothée ADRIEN <timothee.adrien@ynov.com>
 *
 */

'use strict';

// REQUIRE
const path       = require('path');
const express    = require('express');
const app        = express();
const http       = require('http').Server(app);
const bodyParser = require('body-parser');
const colors     = require('colors');
const io         = require('socket.io')(http);

// INIT
const port = process.env.PORT || 3000;

// MONGOOSE
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost/pyzzaDB';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
      console.log("Mongo connected")
    });



// Server Event
//const ServerEvent = require('./Controller/ServerEvent');

// Socket.io
//http.listen(port);

// General Conf
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'View')));
app.use(express.static(path.join(__dirname, 'node_modules', 'socket.io-client', 'dist')));

// Require Controller
const Pizza = require('./Controller/pyzzaController');
const Ingredient = require('./Controller/ingredientController');

// Conf Routes
app.use('/pizza', Pizza);
app.use('/ingredient', Ingredient);
app.use(express.static(path.join(__dirname, 'public')));

let server = app.listen(port, () => {
    console.log(`Starting WebServer at ${port}`);
});


function stop() {
    server.close();
}

module.exports = app;
module.exports.stop = stop;