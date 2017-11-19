'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authentification
router.post('/', function (req, res, next) {
    if(req.body.username == "titi" && req.body.password == "mdp"){
        let token = jwt.sign({ username: req.body.username }, 'Etre secret ou ne pas letre');
        res.status(200).json(token);
    }
    else {
        res.status(500);
        res.json({ message: "Mauvais credentials" });
    }
})

module.exports = router