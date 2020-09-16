const mongoose = require('mongoose')
const Schema = mongoose.Schema //para crear un schema de mongoDB

// se crea el schema de nuestra entidad
const EmployeeSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Employee = mongoose.model('employee', EmployeeSchema) //así se llamará nuestra collections en mongo