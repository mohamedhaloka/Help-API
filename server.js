const express = require('express')
const dotenv = require("dotenv");

const globalErrorMiddleware = require('./middleware/errorMiddleware')

const ApiError = require('./utils/apiError')
const dbConnection = require('./config/dbConnection')


const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const postRoute = require('./routes/postRoute')
const commentRoute = require('./routes/commentRoute')

const app = express()

app.use(express.json())
dotenv.config({ path: './config.env' })

dbConnection()

app.listen(8000, () => {
    console.log('listening on port 8000')
})

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'initial page',
    })
})

app.use('/api/v1/users', userRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/posts', postRoute)
app.use('/api/v1/comments', commentRoute)

app.all('*', (req, res, next) => {
    next(new ApiError(404, `Route [${req.method}] ${req.originalUrl} not found`))
})

app.use(globalErrorMiddleware)

