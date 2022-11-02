const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT || 8000

// app.use(express.urlencoded({extended: true})); // New
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static(__dirname + '/public'));

app.get("/", (req,res)=>{
    res.json("server start")
})
// Routes

const router = require('./src/routes/report1')

app.use('/api/report1', router)    

// Listen on port 8000
app.listen(port, () => console.log(`Listening on port ${port}`))



  