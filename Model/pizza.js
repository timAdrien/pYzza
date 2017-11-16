
//Require Mongoose
let mongoose = require('mongoose');

// Schema mongoose
let Schema = mongoose.Schema;

// Schema PizzaSchema
/**
 * @class pizza
 * @param {String} nom - Nom de la pizza (Requis)
 * @param {String} description - Courte description accrocheur de la pizza sexy (Requis)
 * @param {String} photo - Image de la pizza stocké en base 64
 * @param {Array} ingredients - Liste des ingredients (Requis)
 * @param {Number} prix - Prix de la pizza (Requis)
 * @param {Date} create_at - Date de création
 * @param {Date} update_at - Date de mise à jour
 * @return {Schema}
 */
const pizza = new Schema({
    nom              : { type: String, uniq: true, required: true },
    description      : { type: String, required: true },
    photo            : { data: String, contentType: String },
    prix             : { type: Number, required: true },
    ingredient_ids   : [{ type: Schema.Types.ObjectId, ref: 'Ingredient', required: true }],
    created_at       : { type: Date },
    updated_at       : { type: Date },
}, { emitIndexErrors: true });

pizza.pre('save', function(next) {
    this.updated_at = Date.now();
    if (this.isNew) {
        this.created_at = this.update_at;
    }
    
   mongoose.model('Ingredient').update({ _id: { $in: this.ingredient_ids }}, { multi: true }).exec();

    next();
});

// Remove les id des ingredients referençants la pizza 
/*pizza.pre('', function(next) {
    this.update_at = Date.now();
    next();
})*/

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
pizza.post('save', handleE11000);
pizza.post('update', handleE11000);
pizza.post('findOneAndUpdate', handleE11000);
pizza.post('insertMany', handleE11000);


//Fonction d'export pour le model "pizza"
module.exports = mongoose.model('pizza', pizza );