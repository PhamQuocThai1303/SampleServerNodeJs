const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOption = require('./config/corsOption')

const PORT = process.env.PORT || 3500

app.use(logger)

app.use(cors(corsOption))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public'))) //static

app.use('/', require('./routes/root')) //root

app.all('*', (req, res) => { //cath-all middleware that go wrong path
    res.status(404)
    if (req.accepts('html')) { //If client require HTML, send to 404.html
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) { //If client require json, res is a json with 404 message
        res.json({ message: '404 not found' })
    }
    else { //else res is a simple text have 404 message 
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))