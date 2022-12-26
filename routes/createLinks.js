const express = require('express')
const { nanoid } = require('nanoid')
const urlValidator = require('../utils/Utils.js')

const Url = require('../models/Url.js')
const User = require('../models/User.js')
const dotenv = require('dotenv')

dotenv.config()

const router = express.Router()

router.post('/', async (req, res) => {
    const {oriUrl, id, email} = req.body
    
    if (urlValidator(oriUrl)) {
      try {
        const user = await User.findOne({email})
        if (!user) return res.status(404).send('User Not Found')
        
        let newMiniurl = process.env.BASE_URL + 'go/' + id
        const newLink = await Url.create({
          uID: nanoid(8),
          urlID: id,
          oriUrl: oriUrl,
          miniUrl: newMiniurl,
          owner: email,
          date: new Date(),
        })
        
        user?.links.push(newLink.uID)
        await user.save()
        
        console.log(user, newLink)
        res.json(newLink)
      } catch (err){
        res.status(500).json("Server Error")
        console.log(err)
      }
    } else {
      res.status(400).json("Invalid Link")
      console.log("Invalid Link")
    }
})

module.exports = router