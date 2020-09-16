const express = require('express')
const employees = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken') //esto lo usamos para crear un token

const Employee = require('../models/Employee') //hacemos uso de nuestro modelo de entidad
employees.use(cors())

process.env.SECRET_KEY = 'secret'

employees.post('/register', (req, res) => { //se crea el metodo post que se accede por medio de la ruta /register
    //la ruta base está en server.js y sería para acceder: localhost:3000/ruta_indicada_en_server/register
    const today = new Date()
    const employeeData = { //se construye la entidad
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }

    Employee.findOne({ //se busca si ya existe ese email
            email: req.body.email
        })
        //TODO bcrypt
        .then(employee => {
            if (!employee) { //si no existe el empleado entonces
                Employee.create(employeeData) //crea el empleado
                    .then(employee => {
                        const payload = { //con la siguiente data:
                            _id: employee._id,
                            first_name: employee.first_name,
                            last_name: employee.last_name,
                            email: employee.email
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY, { //seteamos el token
                            expiresIn: 1440 //le damos un tiempo de expiración a la sesión
                        })
                        res.json({ token: token })
                    })
                    .catch(err => { //casteamos el error por si hay uno con la insersión
                        res.send('error: ' + err)
                    })
            } else { //si el empleado ya existe
                res.json({ error: 'Employee already exists' }) //le decimos que ya existe el empleado
            }
        })
        .catch(err => { //casteamos el error por si hay uno con la busqueda
            res.send('error: ' + err)
        })
})

employees.post('/login', (req, res) => {
    Employee.findOne({
            email: req.body.email
        })
        .then(employee => {
            if (employee) {
                const payload = {
                    _id: employee._id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({ token: token })
            } else {
                res.json({ error: 'Employee does not exist' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

employees.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Employee.findOne({
            _id: decoded._id
        })
        .then(employee => {
            if (employee) {
                res.json(employee)
            } else {
                res.send('Employee does not exist')
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = employees