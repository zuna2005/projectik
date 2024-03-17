const express = require('express')
const cors = require('cors')
const usersRoutes = require('./routes/users-routes')
const collectionsRoutes = require('./routes/collections-routes')
require('dotenv').config()

const app = express()
app.use(cors());
app.use(express.json())

app.use('/users', usersRoutes)
app.use('/collections', collectionsRoutes)

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log('listening')
})
