const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT || 8000

app.use(express.urlencoded({extended: true})); // New
const router = require('./src/routes/report1')

app.get("/", (req,res)=>{
    app.use('/api/report1', router)    
})
// Routes



// Listen on port 8000
app.listen(port, () => console.log(`Listening on port ${port}`))



  