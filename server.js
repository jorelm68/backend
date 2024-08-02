require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const mongoose = require('mongoose')

const generalRoutes = require('./general/routes/general')
const photoRoutes = require('./general/routes/photo')

const packAccountRoutes = require('./pack/routes/account')
const packChatRoutes = require('./pack/routes/chat')
const packCodeRoutes = require('./pack/routes/code')
const packEventRoutes = require('./pack/routes/event')
const packGroupRoutes = require('./pack/routes/group')
const packMeetRoutes = require('./pack/routes/meet')
const packMessageRoutes = require('./pack/routes/message')
const packNotificationRoutes = require('./pack/routes/notification')
const packPlaceRoutes = require('./pack/routes/place')
const packStudentRoutes = require('./pack/routes/student')
const packTraitRoutes = require('./pack/routes/trait')

const portfolioPostRoutes = require('./portfolio/routes/post')

// express app
const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// CORS
app.use(cors())

// middleware
app.use(express.json())

// Configure Multer
const upload = multer()

// Middleware to process files
app.use((req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors
            return res.status(400).json({ error: 'File upload error: ' + err.message, data: null })
        } else if (err) {
            // Handle other errors
            return res.status(400).json({ error: 'File upload error: ' + err.message, data: null })
        }
        next()
    })
})

// Set up middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Log each request
app.use((req, res, next) => {
    next()
})

// Middleware to process the API key
const apiKeyMiddleware = (req, res, next) => {
    return next();
    if (req.path.includes('photo/initials') || req.path.includes('portfolio/post')) {
        return next()
    }

    const apiKey = req.header('x-api-key')

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // API key is valid, continue to the next middleware or route handler
    next()
}
app.use('/api', apiKeyMiddleware)

// routes
app.use('/api/general', generalRoutes)
app.use('/api/photo', photoRoutes)

app.use('/api/pack/account', packAccountRoutes)
app.use('/api/pack/chat', packChatRoutes)
app.use('/api/pack/code', packCodeRoutes)
app.use('/api/pack/event', packEventRoutes)
app.use('/api/pack/group', packGroupRoutes)
app.use('/api/pack/meet', packMeetRoutes)
app.use('/api/pack/message', packMessageRoutes)
app.use('/api/pack/notification', packNotificationRoutes)
app.use('/api/pack/place', packPlaceRoutes)
app.use('/api/pack/student', packStudentRoutes)
app.use('/api/pack/trait', packTraitRoutes)

app.use('/api/portfolio/post', portfolioPostRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`connected to MongoDB & listening on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })