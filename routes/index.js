const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.send("Hiii This Api is Acitve")
})

module.exports =  router