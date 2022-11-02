'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require("dotenv");

dotenv.config();

const app = express()

const port = process.env.PORT || 8000

// Static Files
// app.use(express.static('public'))
// app.use('/', express.static(path.join(__dirname, 'public')));


// Templating Engine
app.set('views', './src/views')
app.set('view engine', 'ejs')

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); // Deprecated
app.use(express.urlencoded({extended: true})); // New


// Routes

const router = require('./src/routes/report1')
// const router2 = require('./src/routes/updateStatus')

//Route for send PDF to clients whatsapp || Postman:(http://localhost:8000/api/report1/blank_zakaza)

app.use('/api/report1', router)    
//

//Route to send status update to clients whatsapp || Postman:(http://localhost:8000/api/status/statusupdate)

// app.use('/api/status',router)    



// Listen on port 8000
app.listen(port, () => console.log(`Listening on port ${port}`))



  