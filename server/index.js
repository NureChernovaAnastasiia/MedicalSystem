require('dotenv').config()
const express = require('express')
const sequelize = require ('./db')
const models = require('./models/models.js')
const cors = require('cors')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
