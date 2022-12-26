const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db.js')

const loginController = require('./controller/userController.js')
const { verifyAccess, verifyRefresh } = require('./middleware/verifyToken.js')
const { createLink, addOwner, removeOwner, updateLink, getLink } = require("./controller/linksController.js")
const redirect = require("./routes/redirect.js")

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

dotenv.config()

// Unprotected Routes
app.get('/', (req, res) => {
  res.send("Hiii This Api is Acitve")
})

app.use('/go', redirect)
app.post('/auth/login', loginController)
app.post('/auth/refresh', verifyRefresh)

app.post('/link/get', verifyAccess, getLink)
app.post('/link/create', verifyAccess, createLink)
app.post('/link/addowner', verifyAccess, addOwner)
app.post('/link/removeowner', verifyAccess, removeOwner)
app.post('/link/update', verifyAccess, updateLink)

//app.post('/protected', verifyAccess, async (req, res, next) => {
//  res.json(req.body.test)
//})

app.post('/auth/checkToken', verifyAccess, async (req, res, next) => {
  res.status(200).send('valid')
})


connectDB()

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`)
})