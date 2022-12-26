const express = require('express')
const Url = require('../models/Url.js')

const router = express.Router()

router.get('/:id', async (req, res, next) => {
  try {
    const findUrl = await Url.findOne({urlID: req.params.id})
    
    if (findUrl) {
      findUrl.clicks += 1
      await findUrl.save()
      console.log(findUrl)
      next()
      if (findUrl.oriUrl.match(/^www\..*/i)) return res.redirect(301, "https://" + findUrl.oriUrl)
      return res.status(301).redirect(301, findUrl.oriUrl)
    } else {
      res.status(404).json("Url Not Found!")
    }
  } catch (err){
    res.status(500).json("Server Error")
    console.log(err)
  }
})

module.exports = router
