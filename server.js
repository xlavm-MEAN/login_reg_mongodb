var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express() //indicamos el uso de express para nuestro middleware
const mongoose = require('mongoose') //indicamos que usaremos mongoose
var port = process.env.PORT || 3000 //indicamos el puerto donde correrá nuestra app

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

const mongoURI = 'mongodb://localhost:27017/ingeweb' //indicamos la dirección de nuestra base de datos

mongoose
    .connect(
        mongoURI, { useNewUrlParser: true } //realizamos la conexión con la BD
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

var Employees = require('./routes/Employees') //indicamos que hacemos uso de Employee que está en routes
app.use('/employees', Employees) //declaramos la route para el empleado. en este caso la ruta base es: localhost:3000/employees

app.listen(port, function() {
    console.log('Server is running on port: ' + port)
})