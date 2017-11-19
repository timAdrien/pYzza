
//Require Mongoose
let mongoose = require('mongoose');

// Schema mongoose
let Schema = mongoose.Schema;

// Schema HistoriqueSchema
/**
 * @class historique
 * @param {String} type - Type de l'objet modifié (Requis)
 * @param {String} action - Type de la modification apportée (Put ou delete) (Requis)
 * @param {String} oldObject - Ancien objet (Requis)
 * @param {String} newObject - Nouvel objet (Requis)
 * @param {Date} create_at - Date de création
 * @param {Date} update_at - Date de mise à jour
 * @return {Schema}
 */
const historique = new Schema({
    type             : { type: String, required: true },
    action           : { type: String, required: true },
    oldObject        : { type: String, required: true },
    newObject        : { type: String, required: true },
    created_at       : { type: Date },
    updated_at       : { type: Date },
}, { emitIndexErrors: true });

historique.pre('save', function(next) {
    this.updated_at = Date.now();
    if (this.isNew) {
        this.created_at = this.update_at;
    }
    
    next();
});

// Fonction d'export pour le model "historique"
module.exports = mongoose.model('historique', historique );