const express = require('express')
const User = require('../models/User.js')
const Url = require('../models/Url.js')

const router = express.Router()

router.post('/links', async (req, res) => {
  const email = req.user.email
  if (!email) return res.status(403).send('Unauthorized')
  
  const user = await User.findOne({email})
  const userLinks = user?.links
  
  const links = await Url.find({ 'uID': { $in: userLinks } })
  res.status(200).json(links)
})

module.exports = router