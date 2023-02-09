const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Nom Employé"],
    },
    function: {
        type: String,
        required: [true, "Fonction"],
    },
    photo: {
        type: String,
        required: [true, "Photo"],
    },
    blame: {
        type: Number,
        required: [true, "Nombre de blâme"],
        default: 0
    },
    company: {
        type: String,
    }
})

const employeeModel = mongoose.model('employee', employeeSchema);
module.exports = employeeModel;