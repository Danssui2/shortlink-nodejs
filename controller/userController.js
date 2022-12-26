const axios = require('axios')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/User.js')
const { createAccess, createRefresh } = require('../middleware/verifyToken.js')

dotenv.config()

const loginController = async (req, res) => {
  if (req.body.googleAccessToken) {
    const {googleAccessToken} = req.body
    console.log(googleAccessToken)
    
    axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        "Authorization": `Bearer ${googleAccessToken}`
      }
    }).then(async gresult => {
      const name = gresult.data.given_name
      const email = gresult.data.email
      const picture = gresult.data.picture
  
      const existUser = await User.findOne({email})

      if (!existUser) {
        const newUser = await User.create({email, name, image: picture})
        
        const token = createAccess(newUser.email, newUser._id)
        const refresh = createRefresh(newUser.email, newUser._id)
        return res.status(200).json({result: newUser, token, refresh})
      } else {
        const token = createAccess(existUser.email, existUser._id)
        const refresh = createRefresh(existUser.email, existUser._id)
        return res.status(200).json({result: existUser, token, refresh})
      }
    })
    .catch(err => {
        res.status(400).json({message: "Invalid access token!"})
        console.log(err)
    })
  }
}

module.exports = loginController