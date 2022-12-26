const express = require('express')

const loginController = require('../controller/userController.js')

const router = express.Router()

router.post('/login', loginController)

module.exports = router