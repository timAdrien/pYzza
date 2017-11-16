'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ingredient = new Schema({
    nom        : { type: String, uniq: true, required: true },
    poids      : { type: String, required: true },
    prix       : { type: Number, required: true },
    created_at : { type: Date },
    updated_at : { type: Date },
}, { emitIndexErrors: true });

ingredient.pre('save', function(next) {
  this.update_at = Date.now();
  if (this.isNew) {
    this.create_at = this.update_at;
  }
  next();
});

ingredient.pre('findOneAndRemove', function(next) {
  mongoose.model('pizza').update({}, { $pull: { ingredient_ids: this._conditions.nom }}, { multi: true }).exec();
  next();
});

var handleE11000 = function(error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    let error = new Error('Erreur de duplication de clé unique...');
    error.code = 11000;
    next(error);
  } else {
    next();
  }
};

// Application de la gestion d'erreur de duplication de clé unique sur 4 méthodes
ingredient.post('save', handleE11000);
ingredient.post('update', handleE11000);
ingredient.post('findOneAndUpdate', handleE11000);
ingredient.post('insertMany', handleE11000);


module.exports = mongoose.model('Ingredient', ingredient);