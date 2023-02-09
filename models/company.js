const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Nom Entreprise"],
    },
    siret: {
        type: Number,
        required: [true, "Numéro de siret"],
    },
    mail: {
        type: String,
        required: [true, "Adresse e-mail"],
    },
    directeur: {
        type: String,
        required: [true, "Nom du directeur"],
    },
    password: {
        type: String,
        required: [true, "Mot de passe"],
    },
    employee: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref : "employee"
        }],
    },

})

const companyModel = mongoose.model('companies', companySchema);
module.exports = companyModel;